@echo off
setlocal

title TalentLoop AI - Career Matching and Recruitment Platform
color 0B

echo ======================================================================
echo                TALENTLOOP AI PLATFORM STARTUP SCRIPT
echo ======================================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

cd /d "%~dp0"

:: Recreate a missing or non-Windows virtual environment.
if not exist "backend\venv\Scripts\python.exe" (
    if exist "backend\venv" rmdir /s /q "backend\venv"
    echo [*] Creating backend virtual environment...
    python -m venv backend\venv
    if errorlevel 1 (
        echo [ERROR] Could not create the Python virtual environment.
        pause
        exit /b 1
    )
)

:: Always verify/install requirements. The project archive may contain an
:: incomplete environment, so checking only whether the venv folder exists
:: is not sufficient.
echo [*] Installing/verifying backend dependencies...
call "backend\venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 (
    echo [ERROR] Could not upgrade pip.
    pause
    exit /b 1
)
call "backend\venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if errorlevel 1 (
    echo [ERROR] Backend dependency installation failed.
    pause
    exit /b 1
)

:: Install and build the frontend when its production bundle is absent.
if not exist "frontend\dist\index.html" (
    echo [*] Installing frontend dependencies and building the app...
    pushd frontend
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed. Check Node.js/npm installation.
        popd
        pause
        exit /b 1
    )
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Frontend build failed.
        popd
        pause
        exit /b 1
    )
    popd
)

echo.
echo ======================================================================
echo [OK] Starting TalentLoop AI at http://localhost:8000
echo Demo Candidate: alex@talentloop.ai / TalentLoop2026!
echo Demo Recruiter: recruiter@techloop.io / TalentLoop2026!
echo ======================================================================
echo.

start "" /b cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:8000"

cd /d "%~dp0backend"
"venv\Scripts\python.exe" run.py

pause
