# Quick Testing Checklist (5 Minutes)

## 🚀 Go Live Test

**URL:** http://localhost:5173

---

## ✅ Must-Have Tests (Do These First)

### [ ] 1. Page Loads
- [ ] Opens without errors
- [ ] Takes <2 seconds
- [ ] Main content visible
- [ ] No blank screen

### [ ] 2. Data Displays
- [ ] Leeds name shows
- [ ] Percentage visible (should be 15-30%)
- [ ] Background is RED (danger zone)
- [ ] No "Error" message

### [ ] 3. Animations Work
- [ ] Percentage animates from 0 to final value
- [ ] Progress bar fills smoothly
- [ ] Shimmer effect visible during load
- [ ] No stuttering or jumps

### [ ] 4. Stats Correct
- [ ] Position: 16 (or similar)
- [ ] Points: 15-27
- [ ] Games Left: ~20
- [ ] All visible and readable

### [ ] 5. Mobile Works
- [ ] Open DevTools (F12)
- [ ] Toggle device mode
- [ ] Select "iPhone SE" (375px)
- [ ] Layout adapts, text readable
- [ ] No horizontal scroll

### [ ] 6. No Errors
- [ ] Open DevTools Console (F12 → Console)
- [ ] No red error messages
- [ ] Clean output

---

## 📊 Verification Tests (5 Minutes)

### [ ] 7. Colors Correct
- [ ] Dark background: navy-black
- [ ] Card background: slightly lighter
- [ ] Text: white (readable)
- [ ] Left edge: yellow/gold accent
- [ ] Progress bar: RED (matches survival tier)

### [ ] 8. Responsive
- [ ] Desktop: Full width, 80px percentage
- [ ] Tablet (768px): Centered, scales down
- [ ] Mobile (375px): Stacked, still readable
- [ ] All devices: No overflow

### [ ] 9. Badge Visible
- [ ] Leeds shield appears (SVG)
- [ ] Has team colors
- [ ] Or fallback: Shows "LEE" text
- [ ] Sized correctly (60px desktop, 50px mobile)

### [ ] 10. Performance
- [ ] Page load: <2 seconds
- [ ] Simulation: <500ms
- [ ] Smooth scrolling
- [ ] No lag or freeze

---

## 🎯 Final Sign-Off

If all 10 items are checked:

✅ **READY FOR NETLIFY DEPLOYMENT**

If any item fails:

❌ **Debug and fix before deploying**

---

## Quick Troubleshooting

### Problem: Page doesn't load
```bash
# Check dev server
curl http://localhost:5173

# Restart if needed
pkill vite
npm run dev
```

### Problem: Blank screen
```bash
# Check console for errors
# Press F12 → Console tab
# Look for red error messages
# Restart: npm run dev
```

### Problem: Percentage shows "--"
```bash
# Mock data not loading
# Check console for errors
# Verify mockData.js exists
# Restart: npm run dev
```

### Problem: Layout broken on mobile
```bash
# CSS not loaded
# Clear cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
# Check DevTools → Network tab
# Verify CSS file downloaded
```

### Problem: Animations stutter
```bash
# Check DevTools → Performance tab
# Record 5 seconds
# Look at FPS graph
# If <30fps: Computer may be slow (not app issue)
# Should still see smooth visual movement
```

---

## What You Should See

```
✨ Professional dark-themed sports calculator
✨ Big animated percentage (19-30% for Leeds)
✨ Red background (high relegation risk)
✨ Smooth count-up animation
✨ Responsive on all sizes
✨ Team badge displays
✨ Clean, fast, no errors
```

---

## What You Should NOT See

```
❌ Errors in console
❌ Blank screen
❌ "Calculating..." forever
❌ Broken layout on mobile
❌ Missing data or "--"
❌ Slow loading (>3 seconds)
❌ Laggy animations
```

---

## Next Steps After Testing

### If All Passed ✅
1. Get football-data.org API key
2. Go to https://app.netlify.com
3. Deploy using NETLIFY_SETUP.md

### If Issues Found ❌
1. Read full LOCAL_TESTING_GUIDE.md
2. Check TESTING_EXPECTED_OUTPUT.md
3. Debug using troubleshooting section
4. Restart dev server if needed

---

## Time Estimate

- Loading: 1 minute
- Visual checks: 2 minutes
- Mobile test: 1 minute
- Verification: 1 minute
- **Total: ~5 minutes**

---

**Ready? Open http://localhost:5173 now!**
