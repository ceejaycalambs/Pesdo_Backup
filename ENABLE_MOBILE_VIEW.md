# How to Enable Mobile View in Browser DevTools

## Quick Steps

### Step 1: Open Developer Tools
- Press **`F12`** or **`Ctrl+Shift+I`** (Windows) / **`Cmd+Option+I`** (Mac)
- Or right-click on the page → **"Inspect"**

### Step 2: Enable Device Toolbar

**Option A: Using the Icon (Easiest)**
1. Look at the **top-left** of the DevTools window
2. Find the **device toolbar icon** (📱) - it looks like a phone/tablet
3. **Click it** - the page will switch to mobile view

**Option B: Using Keyboard Shortcut**
- Press **`Ctrl+Shift+M`** (Windows) / **`Cmd+Shift+M`** (Mac)
- This toggles mobile view instantly!

### Step 3: Select Device Size

Once mobile view is enabled, you'll see a **dropdown at the top**:
- Click the dropdown (shows current device)
- Select:
  - **iPhone 12 Pro** (390x844) - Recommended
  - **iPhone SE** (375x667) - Small mobile
  - **Samsung Galaxy S20** (360x800)
  - **iPad** (768x1024) - Tablet
  - **Responsive** - Custom size

### Step 4: Set Custom Width (Optional)

If you want to test specific breakpoints:
1. Select **"Responsive"** from dropdown
2. Enter width: **375px**, **480px**, or **768px**
3. The page will resize to that width

---

## Visual Guide

```
┌─────────────────────────────────────────┐
│  [📱 Device Toolbar] ← Click this!     │  ← Top of DevTools
│  [iPhone 12 Pro ▼]                      │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  Your webpage in mobile view       │ │
│  │                                     │ │
│  │  [☰] ← Hamburger menu button       │ │
│  │                                     │ │
│  │  Main content...                   │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Where to Find the Button

**In Chrome/Edge DevTools:**

1. **Top-left corner** of DevTools window
2. **Icon looks like:** 📱 (phone/tablet icon)
3. **Tooltip says:** "Toggle device toolbar" when you hover

**If you can't find it:**
- Look for three dots (⋮) menu → "More tools" → "Rendering"
- Or use keyboard shortcut: `Ctrl+Shift+M`

---

## Keyboard Shortcuts

| Action | Windows | Mac |
|--------|---------|-----|
| Open DevTools | `F12` | `F12` |
| Toggle Mobile View | `Ctrl+Shift+M` | `Cmd+Shift+M` |
| Close DevTools | `F12` | `F12` |

---

## What You Should See

**Before (Desktop View):**
- Sidebar always visible
- Full-width layout
- No hamburger button

**After (Mobile View ≤768px):**
- ✅ Hamburger button (☰) in top-left
- ✅ Sidebar hidden by default
- ✅ Main content full-width
- ✅ Stacked layout

---

## Troubleshooting

### Can't find the device toolbar icon?
**Solution:**
- Press `Ctrl+Shift+M` (keyboard shortcut)
- Or: Three dots menu (⋮) → "More tools" → "Rendering" → Enable "Emulate CSS media"

### Mobile view not working?
**Solution:**
1. Make sure DevTools is open (`F12`)
2. Press `Ctrl+Shift+M` to toggle
3. Refresh the page: `Ctrl+R`
4. Check the width is ≤768px

### Want to test specific breakpoint?
**Solution:**
1. Enable mobile view (`Ctrl+Shift+M`)
2. Select "Responsive" from device dropdown
3. Enter width: **375px** (small mobile) or **768px** (tablet)
4. Test your dashboard!

---

## Quick Test

1. ✅ Open: `http://localhost:5173`
2. ✅ Press `F12` (open DevTools)
3. ✅ Press `Ctrl+Shift+M` (enable mobile view)
4. ✅ Select "iPhone 12 Pro" from dropdown
5. ✅ Login as jobseeker
6. ✅ You should see hamburger menu! 🎉

---

**That's it!** The device toolbar icon (📱) is in the **top-left of DevTools**, or just press **`Ctrl+Shift+M`**!

