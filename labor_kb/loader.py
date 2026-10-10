"""자료 폴더의 파일에서 쪽(page) 단위 텍스트를 뽑아낸다.

반환값은 항상 list[str] 이며, 리스트의 i번째 원소가 (i+1)쪽 텍스트다.
쪽 개념이 없는 형식(DOCX, TXT 등)은 일정 분량마다 '쪽'을 나눈다.
"""

from __future__ import annotations

import re
import zipfile
import zlib
from pathlib import Path
from xml.etree import ElementTree

SUPPORTED_EXTS = {".pdf", ".docx", ".hwp", ".hwpx", ".txt", ".md"}

# 쪽 개념이 없는 문서를 나눌 때 한 '쪽'의 대략적인 글자 수
_PSEUDO_PAGE_CHARS = 2000


def extract_pages(path: Path) -> list[str]:
    ext = path.suffix.lower()
    if ext == ".pdf":
        return _pdf_pages(path)
    if ext == ".docx":
        return _split_pseudo_pages(_docx_text(path))
    if ext == ".hwp":
        return _split_pseudo_pages(_hwp_text(path))
    if ext == ".hwpx":
        return _split_pseudo_pages(_hwpx_text(path))
    if ext in (".txt", ".md"):
        return _split_pseudo_pages(_read_text(path))
    raise ValueError(f"지원하지 않는 형식: {path.name}")


def _pdf_pages(path: Path) -> list[str]:
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    pages = []
    for page in reader.pages:
        try:
            pages.append(_clean(page.extract_text() or ""))
        except Exception:  # 손상된 쪽 하나 때문에 전체가 실패하지 않도록
            pages.append("")
    return pages


def _docx_text(path: Path) -> str:
    import docx

    d = docx.Document(str(path))
    parts = [p.text for p in d.paragraphs]
    for table in d.tables:
        for row in table.rows:
            parts.append(" | ".join(cell.text for cell in row.cells))
    return "\n".join(parts)


def _hwpx_text(path: Path) -> str:
    """HWPX(한글 OOXML 형식)는 zip 안의 Contents/section*.xml 에 본문이 있다."""
    parts = []
    with zipfile.ZipFile(path) as z:
        sections = sorted(n for n in z.namelist() if re.match(r"Contents/section\d+\.xml$", n))
        for name in sections:
            root = ElementTree.fromstring(z.read(name))
            for para in root.iter():
                if para.tag.endswith("}p"):
                    text = "".join(t.text or "" for t in para.iter() if t.tag.endswith("}t"))
                    if text.strip():
                        parts.append(text)
    return "\n".join(parts)


def _hwp_text(path: Path) -> str:
    """HWP 5.0(구 한글 형식) 본문 추출.

    HWP는 OLE 복합문서이고, BodyText/Section0, Section1 ... 스트림에 본문 레코드가 들어 있다.
    (압축 여부는 FileHeader의 속성 비트로 판단)
    """
    import olefile

    if not olefile.isOleFile(str(path)):
        raise ValueError("HWP 3.0 이하의 옛 형식이거나 손상된 파일입니다. 한글에서 다시 저장해 주세요")
    with olefile.OleFileIO(str(path)) as ole:
        header = ole.openstream("FileHeader").read()
        flags = int.from_bytes(header[36:40], "little")
        compressed, encrypted, distribution = flags & 0x1, flags & 0x2, flags & 0x4
        if encrypted:
            raise ValueError("암호가 걸린 HWP 파일입니다. 암호를 해제하고 저장해 주세요")
        if distribution:
            raise ValueError("배포용(복사 방지) HWP 문서입니다. 일반 문서로 저장하거나 PDF로 변환해 주세요")

        sections = sorted(
            (e for e in ole.listdir() if len(e) == 2 and e[0] == "BodyText" and e[1].startswith("Section")),
            key=lambda e: int(e[1][len("Section"):] or 0),
        )
        parts = []
        for entry in sections:
            data = ole.openstream(entry).read()
            if compressed:
                data = zlib.decompress(data, -15)
            parts.append(_hwp_records_text(data))
    return "\n".join(parts)


_HWPTAG_PARA_TEXT = 67
# 8칸(16바이트)을 차지하는 인라인·확장 컨트롤 문자들. 나머지 제어 문자는 1칸.
_HWP_WIDE_CONTROLS = {1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23}


def _hwp_records_text(data: bytes) -> str:
    paras, pos = [], 0
    while pos + 4 <= len(data):
        head = int.from_bytes(data[pos : pos + 4], "little")
        tag, size = head & 0x3FF, (head >> 20) & 0xFFF
        pos += 4
        if size == 0xFFF:
            size = int.from_bytes(data[pos : pos + 4], "little")
            pos += 4
        body = data[pos : pos + size]
        pos += size
        if tag != _HWPTAG_PARA_TEXT:
            continue
        chars, i = [], 0
        while i + 2 <= len(body):
            code = int.from_bytes(body[i : i + 2], "little")
            if code in _HWP_WIDE_CONTROLS:
                if code == 9:
                    chars.append("\t")
                i += 16
                continue
            if code in (10, 13):
                chars.append("\n")
            elif code >= 32:
                chars.append(chr(code))
            i += 2
        text = "".join(chars).strip()
        if text:
            paras.append(text)
    return "\n".join(paras)


def _read_text(path: Path) -> str:
    for enc in ("utf-8-sig", "cp949", "euc-kr"):
        try:
            return path.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="ignore")


def _split_pseudo_pages(text: str) -> list[str]:
    text = _clean(text)
    pages, buf = [], ""
    for line in text.split("\n"):
        if len(buf) + len(line) > _PSEUDO_PAGE_CHARS and buf:
            pages.append(buf)
            buf = ""
        buf += line + "\n"
    if buf.strip():
        pages.append(buf)
    return pages or [""]


def _clean(text: str) -> str:
    text = text.replace("\x00", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
