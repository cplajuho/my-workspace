@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not defined ANTHROPIC_API_KEY (
  echo API 키가 등록되지 않았습니다. 설치.bat 를 먼저 실행하세요.
  pause
  exit /b 1
)
echo 노동법지식in 을 시작합니다. 잠시 후 브라우저가 열립니다.
echo (이 창을 닫으면 프로그램이 종료됩니다)
python -m streamlit run app.py
pause
