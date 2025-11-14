# PESDO Web App - Push to GitHub Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PESDO Web App - GitHub Push Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Git
Write-Host "[1/6] Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "✓ $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit
}

# Step 2: Initialize Git
Write-Host ""
Write-Host "[2/6] Initializing Git repository..." -ForegroundColor Yellow
if (-not (Test-Path .git)) {
    git init | Out-Null
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already exists" -ForegroundColor Green
}

# Step 3: Add files
Write-Host ""
Write-Host "[3/6] Adding files to Git..." -ForegroundColor Yellow
git add . 2>&1 | Out-Null
$status = git status --porcelain
if ($status) {
    Write-Host "✓ Files added to staging" -ForegroundColor Green
} else {
    Write-Host "✓ All files already staged or committed" -ForegroundColor Green
}

# Step 4: Commit
Write-Host ""
Write-Host "[4/6] Creating commit..." -ForegroundColor Yellow
$hasCommits = git log --oneline -1 2>&1
if ($LASTEXITCODE -ne 0 -or -not $hasCommits) {
    git commit -m "Initial commit: PESDO Web App - Complete project backup" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Commit created successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠ No changes to commit" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Repository already has commits" -ForegroundColor Green
}

# Step 5: Check remote
Write-Host ""
Write-Host "[5/6] Checking remote repository..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ No remote repository configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "NEXT STEPS:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Create a repository on GitHub:" -ForegroundColor White
    Write-Host "   https://github.com/new" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Repository settings:" -ForegroundColor White
    Write-Host "   - Name: pesdo-web-app" -ForegroundColor Gray
    Write-Host "   - Private: Yes" -ForegroundColor Gray
    Write-Host "   - DO NOT initialize with README" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. After creating, enter the repository URL below:" -ForegroundColor White
    Write-Host ""
    $repoUrl = Read-Host "GitHub Repository URL (e.g., https://github.com/username/pesdo-web-app.git)"
    
    if ($repoUrl) {
        git remote add origin $repoUrl 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Remote added successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to add remote" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit
        }
    } else {
        Write-Host "No URL provided. Exiting." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "To add remote later, run:" -ForegroundColor Yellow
        Write-Host "git remote add origin https://github.com/YOUR_USERNAME/pesdo-web-app.git" -ForegroundColor White
        Read-Host "Press Enter to exit"
        exit
    }
} else {
    Write-Host "✓ Remote repository: $remote" -ForegroundColor Green
}

# Step 6: Push
Write-Host ""
Write-Host "[6/6] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

# Set branch to main
git branch -M main 2>&1 | Out-Null

# Push
Write-Host "Attempting to push..." -ForegroundColor Gray
Write-Host "Note: You may be prompted for credentials." -ForegroundColor Gray
Write-Host "Use your GitHub username and Personal Access Token as password." -ForegroundColor Gray
Write-Host ""

git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ SUCCESS! Project pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Push failed. Common issues:" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "1. Authentication required:" -ForegroundColor Yellow
    Write-Host "   - Use Personal Access Token (not password)" -ForegroundColor White
    Write-Host "   - Create token: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "   - Select 'repo' scope" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Repository doesn't exist:" -ForegroundColor Yellow
    Write-Host "   - Make sure you created it on GitHub first" -ForegroundColor White
    Write-Host ""
    Write-Host "3. Try again manually:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"

