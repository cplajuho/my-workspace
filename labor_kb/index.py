"""자료 폴더 색인과 검색.

- 파일별 추출 결과는 .index/ 에 캐시한다. 파일의 크기·수정시각이 바뀌면 다시 추출한다.
- 검색은 한글 2글자 단위(bigram) + 단어 단위 토큰에 BM25 점수를 매기는 방식이다.
  외부 형태소 분석기 없이도 '연차휴가', '통상임금' 같은 용어를 잘 찾는다.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from .loader import SUPPORTED_EXTS, extract_pages

_CACHE_VERSION = 1
_CHUNK_CHARS = 1200
_WORD_RE = re.compile(r"[가-힣]+|[A-Za-z]+|\d+")


@dataclass
class Chunk:
    doc: str  # 자료 폴더 기준 상대 경로
    page: int  # 1부터 시작
    text: str


@dataclass
class Hit:
    chunk: Chunk
    score: float


def tokenize(text: str) -> list[str]:
    tokens = []
    for word in _WORD_RE.findall(text.lower()):
        tokens.append(word)
        if len(word) > 2 and "가" <= word[0] <= "힣":
            tokens.extend(word[i : i + 2] for i in range(len(word) - 1))
    # 조문 번호(제60조 등)는 숫자+조 형태로 붙여서도 찾을 수 있게 한다
    tokens.extend(m.replace(" ", "") for m in re.findall(r"제\s*\d+\s*조", text))
    return tokens


class KnowledgeBase:
    def __init__(self, docs_dirs: Path | list[Path], cache_dir: Path, exclude: list[str] | None = None):
        """docs_dirs: 자료 폴더 하나 또는 여러 개(예: 로컬 자료 폴더 + 구글드라이브 동기화 폴더).
        exclude: 경로에 이 글자가 들어간 파일·폴더는 읽지 않는다(예: 구판 자료)."""
        self.exclude = list(exclude or [])
        if isinstance(docs_dirs, (str, Path)):
            docs_dirs = [docs_dirs]
        self.docs_dirs = [Path(d).expanduser() for d in docs_dirs]
        self.cache_dir = Path(cache_dir)
        self.pages: dict[str, list[str]] = {}
        self.chunks: list[Chunk] = []
        self.warnings: list[str] = []
        self._postings: dict[str, list[tuple[int, int]]] = {}
        self._doc_len: list[int] = []
        self._avg_len = 0.0

    # ------------------------------------------------------------------ 색인
    def build(self, progress: Callable[[str], None] = print) -> None:
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.docs_dirs[0].mkdir(parents=True, exist_ok=True)
        self.pages, self.warnings = {}, []

        for docs_dir in self.docs_dirs:
            if not docs_dir.is_dir():
                self.warnings.append(f"{docs_dir}: 폴더를 찾을 수 없습니다. 경로를 확인해 주세요.")
                continue
            # 첫 번째(기본) 폴더는 파일 이름 그대로, 추가 폴더는 '폴더이름/파일' 로 표시
            label = "" if docs_dir == self.docs_dirs[0] else docs_dir.name + "/"
            self._build_dir(docs_dir, label, progress)

        self._build_bm25()

    def _build_dir(self, docs_dir: Path, label: str, progress: Callable[[str], None]) -> None:
        files = sorted(
            p for p in docs_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS
            and not p.name.startswith(("~$", ".")) and not self._excluded(p)
        )
        for path in files:
            rel = label + path.relative_to(docs_dir).as_posix()
            try:
                pages = self._load_cached(path, rel, progress)
            except Exception as e:
                self.warnings.append(f"{rel}: 읽기 실패 ({e})")
                continue
            if path.suffix.lower() == ".pdf" and sum(len(p) for p in pages) / max(1, len(pages)) < 30:
                self.warnings.append(f"{rel}: 추출된 글자가 거의 없습니다. 스캔본(이미지) PDF일 수 있습니다.")
            self.pages[rel] = pages

        for path in docs_dir.rglob("*"):
            ext = path.suffix.lower()
            if ext in (".gdoc", ".gsheet", ".gslides") and not self._excluded(path):
                self.warnings.append(
                    f"{path.name}: 구글 문서 바로가기는 읽을 수 없습니다. 드라이브에서 PDF/DOCX로 다운로드해 넣어 주세요."
                )

    def _excluded(self, path: Path) -> bool:
        """'/정규식/' 형태는 경로의 각 폴더·파일 이름에 정규식으로, 나머지는 경로 전체에 글자 포함으로 검사한다."""
        text = path.as_posix()
        for pattern in self.exclude:
            if len(pattern) > 2 and pattern.startswith("/") and pattern.endswith("/"):
                regex = re.compile(pattern[1:-1])
                if any(regex.search(part) for part in path.parts):
                    return True
            elif pattern in text:
                return True
        return False

    def _load_cached(self, path: Path, rel: str, progress: Callable[[str], None]) -> list[str]:
        stat = path.stat()
        key = hashlib.sha1(str(path.resolve()).encode()).hexdigest()
        cache_file = self.cache_dir / f"{key}.json"
        if cache_file.exists():
            cached = json.loads(cache_file.read_text(encoding="utf-8"))
            if (
                cached.get("version") == _CACHE_VERSION
                and cached.get("size") == stat.st_size
                and cached.get("mtime") == stat.st_mtime
            ):
                return cached["pages"]

        progress(f"  · 새 자료 읽는 중: {rel} (큰 PDF는 몇 분 걸릴 수 있습니다)")
        pages = extract_pages(path)
        cache_file.write_text(
            json.dumps(
                {"version": _CACHE_VERSION, "path": rel, "size": stat.st_size,
                 "mtime": stat.st_mtime, "pages": pages},
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        return pages

    def _build_bm25(self) -> None:
        self.chunks = []
        for doc, pages in self.pages.items():
            for i, page_text in enumerate(pages, start=1):
                for start in range(0, max(len(page_text), 1), _CHUNK_CHARS):
                    piece = page_text[start : start + _CHUNK_CHARS + 200]  # 200자 겹침
                    if piece.strip():
                        self.chunks.append(Chunk(doc, i, piece))

        postings: dict[str, list[tuple[int, int]]] = defaultdict(list)
        self._doc_len = []
        for idx, chunk in enumerate(self.chunks):
            tf = Counter(tokenize(chunk.text))
            self._doc_len.append(sum(tf.values()))
            for term, count in tf.items():
                postings[term].append((idx, count))
        self._postings = dict(postings)
        self._avg_len = (sum(self._doc_len) / len(self._doc_len)) if self._doc_len else 0.0

    # ------------------------------------------------------------------ 검색
    def search(self, query: str, top_k: int = 8, doc_filter: str | None = None) -> list[Hit]:
        if not self.chunks:
            return []
        n = len(self.chunks)
        k1, b = 1.5, 0.75
        scores: dict[int, float] = defaultdict(float)
        for term in set(tokenize(query)):
            plist = self._postings.get(term)
            if not plist:
                continue
            idf = math.log(1 + (n - len(plist) + 0.5) / (len(plist) + 0.5))
            for idx, tf in plist:
                norm = tf * (k1 + 1) / (tf + k1 * (1 - b + b * self._doc_len[idx] / self._avg_len))
                scores[idx] += idf * norm

        ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
        hits, seen = [], set()
        for idx, score in ranked:
            chunk = self.chunks[idx]
            if doc_filter and doc_filter not in chunk.doc:
                continue
            if (chunk.doc, chunk.page) in seen:
                continue
            seen.add((chunk.doc, chunk.page))
            hits.append(Hit(chunk, score))
            if len(hits) >= top_k:
                break
        return hits

    def read_pages(self, doc: str, start: int, end: int) -> str:
        """doc 이름은 부분 일치도 허용한다(모델이 경로를 줄여 부를 때 대비)."""
        name = doc if doc in self.pages else next((d for d in self.pages if doc in d), None)
        if name is None:
            raise KeyError(f"'{doc}' 자료를 찾을 수 없습니다. 목록: {', '.join(self.pages) or '(없음)'}")
        pages = self.pages[name]
        start = max(1, start)
        end = min(len(pages), end, start + 9)  # 한 번에 최대 10쪽
        return "\n\n".join(f"[{name} p.{i}]\n{pages[i - 1]}" for i in range(start, end + 1))

    def summary(self) -> str:
        if not self.pages:
            return "(자료 폴더가 비어 있습니다)"
        return "\n".join(f"- {doc} ({len(pages)}쪽)" for doc, pages in self.pages.items())
