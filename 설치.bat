@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PYTHONUTF8=1"
echo [설치] 파이썬 확인 중...
call :FIND_PY
if defined PY goto HAVE_PY
echo [설치] 파이썬이 없어 자동으로 설치합니다. (1~2분)
winget install -e --id Python.Python.3.12 --scope user --silent --accept-package-agreements --accept-source-agreements >nul
call :FIND_PY
if not defined PY goto NO_PYTHON

:HAVE_PY
if not exist ".venv\Scripts\python.exe" "%PY%" -m venv .venv
echo [설치] 필요한 프로그램 설치 중... (처음엔 몇 분 걸립니다)
".venv\Scripts\python.exe" -m pip install -q --upgrade pip
".venv\Scripts\python.exe" -m pip install -q -r requirements.txt
if errorlevel 1 goto PIP_FAIL

if defined ANTHROPIC_API_KEY goto DONE
echo.
echo ------------------------------------------------------------
echo  Anthropic API 키를 한 번만 입력해 주세요.
echo  (https://console.anthropic.com 의 API Keys 메뉴에서 발급, sk-ant- 로 시작)
echo ------------------------------------------------------------
set /p "NEWKEY=API 키 붙여넣기 후 Enter: "
if "%NEWKEY%"=="" goto DONE
setx ANTHROPIC_API_KEY "%NEWKEY%" >nul
set "ANTHROPIC_API_KEY=%NEWKEY%"
echo [설치] API 키를 저장했습니다.
goto DONE

:FIND_PY
set "PY="
for /f "delims=" %%i in ('py -3 -c "import sys;print(sys.executable)" 2^>nul') do set "PY=%%i"
if defined PY exit /b
for /d %%d in ("%LOCALAPPDATA%\Programs\Python\Python3*") do if exist "%%d\python.exe" set "PY=%%d\python.exe"
if defined PY exit /b
for /f "delims=" %%i in ('python -c "import sys;print(sys.executable)" 2^>nul') do set "PY=%%i"
exit /b

:NO_PYTHON
echo [오류] 파이썬을 자동 설치하지 못했습니다.
echo https://www.python.org/downloads/ 에서 설치한 뒤(첫 화면 "Add python.exe to PATH" 체크) 다시 실행하세요.
pause
exit /b 1

:PIP_FAIL
echo [오류] 설치 중 문제가 생겼습니다. 인터넷 연결을 확인하고 다시 실행하세요.
pause
exit /b 1

:DONE
echo [설치] 완료
if /i not "%~1"=="/auto" pause
exit /b 0
