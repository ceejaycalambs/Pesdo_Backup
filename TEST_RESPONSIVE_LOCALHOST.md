# How to Test Responsive Design on Localhost

## Quick Method: Browser Developer Tools

### Step 1: Start Your Development Server

If not already running:
```bash
npm run dev
```

Your app should be running at: `http://localhost:5173`

---

### Step 2: Open Browser Developer Tools

**Chrome/Edge:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Or right-click → "Inspect"

**Firefox:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

**Safari:**
- Press `Cmd+Option+I` (Mac)
- Enable Developer menu first: Safari → Preferences → Advanced → "Show Develop menu"

---

### Step 3: Enable Device Toolbar (Mobile View)

**Chrome/Edge:**
1. Click the **device toolbar icon** (📱) in the top-left of DevTools
   - Or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
2. The page will switch to mobile view

**Firefox:**
1. Click the **responsive design mode icon** (📱) in the toolbar
   - Or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)

**Safari:**
1. Develop → Enter Responsive Design Mode
   - Or press `Cmd+Ctrl+R`

---

### Step 4: Select Device Size

**Chrome/Edge:**
- Use the dropdown at the top to select:
  - **iPhone 12 Pro** (390x844) - Good for testing
  - **iPhone SE** (375x667) - Small mobile
  - **Samsung Galaxy S20** (360x800)
  - **iPad** (768x1024) - Tablet
  - Or enter custom dimensions

**Firefox:**
- Similar dropdown to select device sizes

---

### Step 5: Test the Dashboard

1. **Navigate to:** `http://localhost:5173/login/jobseeker`
2. **Login** with your jobseeker credentials
3. **Check:**
   - ✅ Hamburger menu button (☰) appears in top-left
   - ✅ Sidebar is hidden by default
   - ✅ Main content is visible and scrollable
   - ✅ Click hamburger button → Sidebar slides in
   - ✅ Click outside sidebar → Sidebar closes
   - ✅ Select menu item → Sidebar closes

---

## Test Different Screen Sizes

### Mobile (≤768px)
- Select: iPhone 12 Pro, iPhone SE, or Samsung Galaxy
- **Expected:**
  - Hamburger menu visible
  - Sidebar hidden by default
  - Full-width main content
  - Stacked layout

### Tablet (769px - 1024px)
- Select: iPad or set custom: 768px width
- **Expected:**
  - May show horizontal sidebar or hamburger menu
  - Adjusted spacing

### Desktop (>1024px)
- Disable device toolbar or select "Desktop"
- **Expected:**
  - Fixed sidebar always visible
  - Main content with left margin

---

## Quick Test Checklist

- [ ] Hamburger button appears on mobile (≤768px)
- [ ] Sidebar hidden by default on mobile
- [ ] Main content visible and scrollable
- [ ] Hamburger button opens sidebar
- [ ] Sidebar closes when clicking overlay
- [ ] Sidebar closes when selecting menu item
- [ ] Sidebar closes when pressing Escape
- [ ] Layout looks good on different screen sizes

---

## Alternative: Test on Real Mobile Device

### Step 1: Find Your Local IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" under your network interface

### Step 2: Start Dev Server with Network Access

**Vite (your setup):**
```bash
npm run dev -- --host
```

This will show:
```
Local:   http://localhost:5173
Network: http://192.168.1.100:5173
```

### Step 3: Connect Mobile Device

1. Make sure your phone is on the **same WiFi network**
2. Open browser on phone
3. Go to: `http://192.168.1.100:5173` (use your actual IP)
4. Test the dashboard!

---

## Common Issues & Solutions

### Issue: Can't see hamburger button
**Solution:**
- Make sure device toolbar is enabled
- Check screen width is ≤768px
- Refresh the page

### Issue: Sidebar always visible
**Solution:**
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)
- Check if `mobileMenuOpen` state is working

### Issue: Button doesn't work
**Solution:**
- Check browser console for errors (F12)
- Make sure JavaScript is enabled
- Try clicking the button directly (not the icon inside)

### Issue: Can't access on mobile device
**Solution:**
- Make sure both devices are on same WiFi
- Check firewall isn't blocking port 5173
- Try disabling firewall temporarily for testing

---

## Browser DevTools Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Open DevTools | `F12` or `Ctrl+Shift+I` | `Cmd+Option+I` |
| Toggle Device Toolbar | `Ctrl+Shift+M` | `Cmd+Shift+M` |
| Refresh | `F5` | `Cmd+R` |
| Hard Refresh | `Ctrl+Shift+R` | `Cmd+Shift+R` |

---

## Recommended Test Devices (in Browser)

1. **iPhone 12 Pro** (390x844) - Most common mobile size
2. **iPhone SE** (375x667) - Small mobile
3. **Samsung Galaxy S20** (360x800) - Android size
4. **iPad** (768x1024) - Tablet
5. **Custom: 480px** - Extra small mobile

---

## Quick Test Steps

1. ✅ Start dev server: `npm run dev`
2. ✅ Open: `http://localhost:5173`
3. ✅ Press `F12` to open DevTools
4. ✅ Press `Ctrl+Shift+M` to enable mobile view
5. ✅ Select "iPhone 12 Pro" from dropdown
6. ✅ Login as jobseeker
7. ✅ Test hamburger menu!

**That's it!** You can now test the responsive design easily! 🎉

