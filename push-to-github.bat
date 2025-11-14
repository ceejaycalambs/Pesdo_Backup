@echo off
echo ========================================
echo PESDO Web App - GitHub Push Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/5] Initializing git repository...
git init
if errorlevel 1 (
    echo Warning: Git init failed or already initialized
)

echo.
echo [2/5] Adding all files to git...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo [3/5] Creating commit...
git commit -m "Initial commit: PESDO Web App - Complete project backup"
if errorlevel 1 (
    echo Warning: Commit failed - files may already be committed
)

echo.
echo [4/5] Checking for remote repository...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo NO REMOTE REPOSITORY CONFIGURED
    echo ========================================
    echo.
    echo Please follow these steps:
    echo.
    echo 1. Go to https://github.com/new
    echo 2. Create a new repository (name it: pesdo-web-app)
    echo 3. Choose PRIVATE repository
    echo 4. DO NOT initialize with README, .gitignore, or license
    echo 5. Click "Create repository"
    echo 6. Copy the repository URL (e.g., https://github.com/YOUR_USERNAME/pesdo-web-app.git)
    echo.
    set /p REPO_URL="Enter your GitHub repository URL: "
    if not "!REPO_URL!"=="" (
        git remote add origin !REPO_URL!
        echo.
        echo [5/5] Setting branch to main and pushing...
        git branch -M main
        git push -u origin main
        if errorlevel 1 (
            echo.
            echo ERROR: Push failed!
            echo.
            echo Common issues:
            echo - Authentication required: Use Personal Access Token as password
            echo - Create token at: https://github.com/settings/tokens
            echo - Select 'repo' scope when creating token
        ) else (
            echo.
            echo ========================================
            echo SUCCESS! Project pushed to GitHub!
            echo ========================================
        )
    ) else (
        echo No URL provided. Exiting.
    )
) else (
    echo Remote repository found!
    git remote get-url origin
    echo.
    echo [5/5] Pushing to GitHub...
    git push -u origin main
    if errorlevel 1 (
        git branch -M main
        git push -u origin main
    )
    if errorlevel 1 (
        echo.
        echo ERROR: Push failed!
        echo You may need to authenticate with a Personal Access Token.
    ) else (
        echo.
        echo ========================================
        echo SUCCESS! Project pushed to GitHub!
        echo ========================================
    )
)

echo.
pause

