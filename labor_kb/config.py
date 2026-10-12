"""자료 폴더 설정.

기본 자료 폴더는 프로그램 옆의 '자료/' 이고, '자료폴더.txt' 에 적은 폴더가 추가된다.
'구글드라이브/경로' 는 Google Drive for desktop 의 '내 드라이브' 위치를 찾아 이어 붙인다.
'제외:' 로 시작하는 줄은 경로에 그 글자가 들어간 파일·폴더를 읽지 않게 한다.
"""

from __future__ import annotations

import string
from pathlib import Path

CONFIG_FILE = "자료폴더.txt"
_EXCLUDE_PREFIX = "제외:"
_DRIVE_PREFIX = "구글드라이브/"
_MY_DRIVE_NAMES = ("내 드라이브", "My Drive")

# 구판 실무서와 사건 서류(날짜 6자리+하이픈으로 시작)는 항상 제외
DEFAULT_EXCLUDE = ["2025버전", "개별노동법실무(2025)", r"/^\d{6}-/"]


def load(base: Path) -> tuple[list[Path], list[str]]:
    """(자료 폴더 목록, 제외 패턴 목록)을 돌려준다."""
    dirs, exclude = [base / "자료"], list(DEFAULT_EXCLUDE)
    config = base / CONFIG_FILE
    if config.exists():
        for line in config.read_text(encoding="utf-8-sig").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith(_EXCLUDE_PREFIX):
                pattern = line[len(_EXCLUDE_PREFIX):].strip()
                if pattern and pattern not in exclude:
                    exclude.append(pattern)
            elif line.replace("\\", "/").startswith(_DRIVE_PREFIX):
                dirs.append(_resolve_google_drive(line.replace("\\", "/")[len(_DRIVE_PREFIX):]))
            else:
                dirs.append(Path(line.strip('"')).expanduser())
    return dirs, exclude


def _google_drive_roots() -> list[Path]:
    roots = []
    for letter in string.ascii_uppercase[2:]:  # C: ~ Z:
        roots += [Path(f"{letter}:/") / name for name in _MY_DRIVE_NAMES]
    cloud = Path.home() / "Library" / "CloudStorage"  # Mac
    if cloud.is_dir():
        for account in cloud.glob("GoogleDrive-*"):
            roots += [account / name for name in _MY_DRIVE_NAMES]
    return roots


def _resolve_google_drive(rel: str) -> Path:
    for root in _google_drive_roots():
        try:
            if root.is_dir():
                return root / rel
        except OSError:
            continue
    # 못 찾으면 그대로 돌려줘서 '폴더를 찾을 수 없습니다' 경고가 뜨게 한다
    return Path("구글드라이브(연결 안 됨)") / rel
