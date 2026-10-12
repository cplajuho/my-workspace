@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==========================================
echo   노동법지식in 설치
echo ==========================================
echo.

python --version >nul 2>&1
if errorlevel 1 goto NO_PYTHON

echo [1/2] 필요한 프로그램을 설치합니다...
python -m pip install --upgrade pip >nul
python -m pip install -r requirements.txt
if errorlevel 1 goto PIP_FAIL
echo.

echo [2/2] Anthropic API 키 확인
if defined ANTHROPIC_API_KEY goto HAS_KEY
echo API 키가 아직 등록되지 않았습니다. (https://console.anthropic.com 에서 발급)
set /p NEWKEY=API 키를 붙여넣고 Enter: 
if "%NEWKEY%"=="" goto NO_KEY
setx ANTHROPIC_API_KEY "%NEWKEY%" >nul
echo API 키를 저장했습니다.
goto DONE

:HAS_KEY
echo API 키가 이미 등록되어 있습니다.
goto DONE

:NO_KEY
echo API 키를 입력하지 않았습니다. 나중에 설치.bat 를 다시 실행하세요.
goto DONE

:NO_PYTHON
echo 파이썬이 설치되어 있지 않습니다.
echo https://www.python.org/downloads/ 에서 설치하세요.
echo 설치 화면 첫 페이지의 "Add python.exe to PATH" 를 꼭 체크하세요.
echo 설치 후 이 파일을 다시 실행하세요.
pause
exit /b 1

:PIP_FAIL
echo 설치 중 오류가 났습니다. 위 메시지를 확인해 주세요.
pause
exit /b 1

:DONE
echo.
echo 설치가 끝났습니다. 이제 실행.bat 를 더블클릭하세요.
echo (자료폴더.txt 의 구글드라이브 경로가 이 PC와 맞는지도 확인하세요)
pause
