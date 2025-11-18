# Troubleshooting Supabase Link - Step 4

## Common Issues with `supabase link`

### Issue 1: "Project not found" or "Invalid project ref"

**Solution:**
1. Get your project ref from the Supabase Dashboard URL:
   - Dashboard URL looks like: `https://supabase.com/dashboard/project/qslbiuijmwhirnbyghrh`
   - The project ref is: `qslbiuijmwhirnbyghrh`

2. Try linking with the full project ref:
```powershell
npx supabase link --project-ref qslbiuijmwhirnbyghrh
```

### Issue 2: "Access token not provided" or "Not logged in"

**Solution:**
1. Make sure you logged in first:
```powershell
npx supabase login
```

2. If login didn't work, try with token:
   - Go to: https://supabase.com/dashboard/account/tokens
   - Generate a new access token
   - Then use:
```powershell
$env:SUPABASE_ACCESS_TOKEN="your_token_here"
npx supabase link --project-ref qslbiuijmwhirnbyghrh
```

### Issue 3: "Already linked" or "Project already linked"

**Solution:**
1. Check if project is already linked:
```powershell
npx supabase status
```

2. If already linked, you can skip to Step 5 (set secrets)

3. If you need to unlink and relink:
```powershell
# Remove .supabase folder (if exists)
Remove-Item -Recurse -Force .supabase -ErrorAction SilentlyContinue

# Link again
npx supabase link --project-ref qslbiuijmwhirnbyghrh
```

### Issue 4: "Database password required"

**Solution:**
1. You might need to provide database password:
```powershell
npx supabase link --project-ref qslbiuijmwhirnbyghrh --password your_db_password
```

2. Get database password from:
   - Supabase Dashboard → Settings → Database
   - Or reset it if you don't have it

### Issue 5: Network/Connection Error

**Solution:**
1. Check your internet connection
2. Try again:
```powershell
npx supabase link --project-ref qslbiuijmwhirnbyghrh
```

---

## Alternative: Skip Link and Deploy Directly

If linking keeps failing, you can deploy directly without linking:

```powershell
# Set secrets (requires login)
npx supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615 --project-ref qslbiuijmwhirnbyghrh
npx supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984 --project-ref qslbiuijmwhirnbyghrh

# Deploy function (requires login)
npx supabase functions deploy send-sms --project-ref qslbiuijmwhirnbyghrh
```

---

## What Error Are You Seeing?

Please share:
1. The exact error message
2. What command you ran
3. Any output you see

This will help me provide a specific solution!

