"""자료 폴더 설정.

기본 자료 폴더는 프로그램 옆의 '자료/' 이고, '자료폴더.txt' 에 적은 폴더가 추가된다.
구글드라이브는 'Google Drive for desktop' 이 PC에 만들어 주는 동기화 폴더 경로를 적으면 된다.
'제외:' 로 시작하는 줄은 경로에 그 글자가 들어간 파일·폴더를 읽지 않게 한다.
"""

from __future__ import annotations

from pathlib import Path

CONFIG_FILE = "자료폴더.txt"
_EXCLUDE_PREFIX = "제외:"


def load(base: Path) -> tuple[list[Path], list[str]]:
    """(자료 폴더 목록, 제외 패턴 목록)을 돌려준다."""
    dirs, exclude = [base / "자료"], []
    config = base / CONFIG_FILE
    if config.exists():
        for line in config.read_text(encoding="utf-8-sig").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith(_EXCLUDE_PREFIX):
                pattern = line[len(_EXCLUDE_PREFIX):].strip()
                if pattern:
                    exclude.append(pattern)
            else:
                dirs.append(Path(line.strip('"')).expanduser())
    return dirs, exclude
