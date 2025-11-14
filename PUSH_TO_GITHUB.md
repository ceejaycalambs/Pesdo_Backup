# Push PESDO Web App to GitHub

## Quick Steps

### Step 1: Create GitHub Repository First

1. Go to **https://github.com/new**
2. Repository name: `pesdo-web-app`
3. Choose **Private** (recommended)
4. **DO NOT** check "Initialize with README"
5. Click **"Create repository"**
6. **Copy the repository URL** (you'll see it on the next page)

### Step 2: Run These Commands in PowerShell

Open PowerShell in your project folder (`C:\Users\User\Desktop\pesdo-web-app`) and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: PESDO Web App"

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pesdo-web-app.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Authentication

When you run `git push`, GitHub will ask for credentials:

- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

#### How to Create Personal Access Token:

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Name it: `PESDO Backup`
4. Select scope: **`repo`** (check the box)
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

## Alternative: Use the Batch Script

I've created `push-to-github.bat` - just double-click it and follow the prompts!

## Troubleshooting

### "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/pesdo-web-app.git
```

### "Authentication failed"
- Make sure you're using a Personal Access Token, not your password
- Check that the token has `repo` permissions

### "Repository not found"
- Make sure you created the repository on GitHub first
- Check that the repository URL is correct
- Make sure the repository name matches

## Future Updates

To push future changes:

```powershell
git add .
git commit -m "Description of changes"
git push
```

