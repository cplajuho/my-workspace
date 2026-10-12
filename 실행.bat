@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist ".venv\Scripts\python.exe" call 설치.bat /auto
if not defined ANTHROPIC_API_KEY call 설치.bat /auto
echo 노동법지식in 을 시작합니다. 잠시 후 브라우저에 상담 화면이 열립니다.
echo (이 검은 창을 닫으면 프로그램이 종료됩니다)
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:8501"
".venv\Scripts\python.exe" -m streamlit run app.py --server.headless true --browser.gatherUsageStats false
pause
