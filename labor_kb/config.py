"""자료 폴더 설정.

기본 자료 폴더는 프로그램 옆의 '자료/' 이고, '자료폴더.txt' 에 적은 폴더가 추가된다.
구글드라이브는 'Google Drive for desktop' 이 PC에 만들어 주는 동기화 폴더 경로를 적으면 된다.
"""

from __future__ import annotations

from pathlib import Path

CONFIG_FILE = "자료폴더.txt"


def docs_dirs(base: Path) -> list[Path]:
    dirs = [base / "자료"]
    config = base / CONFIG_FILE
    if config.exists():
        for line in config.read_text(encoding="utf-8-sig").splitlines():
            line = line.strip().strip('"')
            if line and not line.startswith("#"):
                dirs.append(Path(line).expanduser())
    return dirs
