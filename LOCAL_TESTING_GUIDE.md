# Local Testing Guide

**Development Server:** http://localhost:5173
**Status:** ✅ Running
**Mode:** Mock data (no API key required)

---

## Quick Start

The development server is already running!

**Open in browser:** http://localhost:5173

You should see:
- **Header:** "PREMIER LEAGUE SURVIVAL CALCULATOR"
- **Main Card:** Leeds United survival percentage
- **Big Number:** Your survival percentage (animated count-up)
- **Progress Bar:** Visual indicator of survival chances
- **Context Stats:** Position, Points, Games Left

---

## Testing Checklist

### 1️⃣ **Visual Design** (Does it look good?)

#### Header & Footer
- [ ] "PREMIER LEAGUE SURVIVAL CALCULATOR" displays prominently
- [ ] Tagline shows below: "Calculate any team's relegation odds"
- [ ] Footer has Leeds, That! branding
- [ ] Footer link to https://leedsthat.com works

#### Main Card
- [ ] Leeds badge displays (SVG or fallback text "LEE")
- [ ] "Leeds United" team name shows
- [ ] Percentage number is large and bold (80px on desktop)
- [ ] "CHANCE OF SURVIVAL" label is visible
- [ ] Progress bar shows below percentage

#### Colors & Styling
- [ ] Dark background (#0A0E1A) - not too dark, readable
- [ ] Card background is lighter (#1E2740)
- [ ] Yellow/gold accent on left edge of card
- [ ] Text is clear white on dark background
- [ ] No layout shifts or visual glitches

---

### 2️⃣ **Functionality** (Does it work?)

#### Data Loading
- [ ] Simulation starts immediately (you'll see "Calculating..." briefly)
- [ ] Percentage appears within 2 seconds
- [ ] No error messages in browser console (F12)
- [ ] "Chance of Survival" percentage is between 0-100%

#### Color Coding
- [ ] If >70%: Background is GREEN
- [ ] If 40-70%: Background is AMBER/ORANGE
- [ ] If <40%: Background is RED

*Note: Leeds should be around 15-40% (relegation zone)*

#### Progress Bar
- [ ] Fills from 0% to the survival percentage
- [ ] Smooth animation (0.6 seconds)
- [ ] Color matches the survival tier (green/amber/red)
- [ ] Percentage label shows on the bar

#### Stats Display
- [ ] "Position" shows (e.g., "16th")
- [ ] "Points" shows current points (around 27 for Leeds)
- [ ] "Games Left" shows remaining matches (around 20)

#### Simulation Info
- [ ] Historical threshold shows
- [ ] Says "Target: X pts (Y% safe historically)"
- [ ] Example: "Target: 35 pts (92% safe historically)"

---

### 3️⃣ **Animations** (Smooth & Polished?)

#### Count-Up Number
- [ ] Percentage animates from 0 to final value
- [ ] Animation feels bouncy and energetic
- [ ] Takes about 0.4 seconds
- [ ] Smooth motion (no stuttering)

#### Progress Bar
- [ ] Bar smoothly fills to percentage
- [ ] Takes about 0.6 seconds
- [ ] No jumping or jerky movements

#### Shimmer Effect
- [ ] Subtle shimmer effect visible during loading
- [ ] Sweeps left to right
- [ ] Not distracting

#### Page Load
- [ ] Elements fade in smoothly
- [ ] No flash of unstyled content
- [ ] Professional feel

---

### 4️⃣ **Responsive Design** (Mobile Friendly?)

#### Desktop (1920px)
- [ ] Everything displays at full size
- [ ] Percentage number is 80px
- [ ] Easy to read and interact with

#### Tablet (768px)
- [ ] Percentage scales down (around 64px)
- [ ] All elements still visible
- [ ] No horizontal scrolling
- [ ] Touch-friendly sizing

#### Mobile (375px)
- [ ] Percentage is smaller (56px) but readable
- [ ] Team name and badge visible
- [ ] Progress bar full width
- [ ] Stats show vertically
- [ ] No overflow or clipping
- [ ] Can read without zooming

**Test on mobile:**
```bash
# Open DevTools (F12) in Chrome/Firefox
# Click device toggle icon (mobile view)
# Test at 375px width (iPhone SE size)
```

---

### 5️⃣ **Error Handling** (Graceful Fallbacks?)

#### Try Disabling JavaScript
- [ ] Page still loads (basic content visible)
- [ ] Semantic HTML structure
- [ ] No console errors

#### Try with No Data
- [ ] Loading skeleton shows (shimmer effect)
- [ ] No crashes
- [ ] Eventually loads or shows error state

#### Check Browser Console (F12)
- [ ] No JavaScript errors (red errors)
- [ ] No warnings that look problematic
- [ ] Clean console output

---

### 6️⃣ **Performance** (Fast Loading?)

#### Page Load
- [ ] Page loads in <2 seconds
- [ ] Main content visible immediately
- [ ] No long blank screen
- [ ] Smooth scrolling

#### Simulation
- [ ] Calculation completes in <500ms
- [ ] Percentage appears quickly
- [ ] No "frozen" UI during calculation

#### Bundle Size
```bash
# Check in DevTools Network tab:
# index.html: ~3 KB
# CSS: ~14 KB
# JS: ~236 KB
# Total gzipped: ~71 KB ✅
```

---

### 7️⃣ **SEO & Meta Tags** (Search Friendly?)

```bash
# View page source (Ctrl+U or Cmd+U)
# Check for:
```

- [ ] `<title>` contains "Premier League Survival Calculator"
- [ ] `<meta name="description">` present
- [ ] Open Graph tags (`og:title`, `og:description`)
- [ ] Twitter Card tags (`twitter:card`, `twitter:title`)
- [ ] Structured data (`schema.org`)

**View page source:**
- Right-click → "View Page Source"
- Search for `<meta`
- Verify tags are present

---

### 8️⃣ **Accessibility** (Usable by Everyone?)

- [ ] Text is readable (high contrast)
- [ ] Font sizes are appropriate
- [ ] Color not the only information carrier
- [ ] Can tab through elements
- [ ] No flashing/seizure risk

---

### 9️⃣ **Team Badge** (Images Loading?)

- [ ] Leeds badge displays (SVG shield with colors)
- [ ] Badge has team colors
- [ ] Falls back to "LEE" if image fails
- [ ] Proper sizing (60px desktop, 50px mobile)

---

### 🔟 **Mock Data Verification**

The app uses mock Premier League data. Verify:

- [ ] Leeds is at **position 16** (relegation zone)
- [ ] Leeds has around **15-27 points**
- [ ] Leeds has played around **18 games**
- [ ] Games remaining is around **20**
- [ ] All 20 teams have data available

---

## Manual Testing Steps

### Test 1: Full Page Load
```
1. Open http://localhost:5173
2. Wait 2 seconds
3. Verify Leeds data loads with percentage
4. Check no errors in console (F12)
```

### Test 2: Responsive Design
```
1. Press F12 (DevTools)
2. Click device toggle (top left of DevTools)
3. Select "iPhone SE" (375px)
4. Verify layout adapts
5. Scroll and check no overflow
6. Test "iPad" (768px)
7. Test desktop (full width)
```

### Test 3: Animation Smoothness
```
1. Open in latest Chrome/Firefox
2. Watch percentage count-up
3. Watch progress bar fill
4. Verify smooth (no stuttering)
5. Open DevTools → Performance tab
6. Record 5 seconds while animation plays
7. Check FPS (should be 60fps ideally, >30fps minimum)
```

### Test 4: Color Coding
```
1. Note current survival percentage
2. If >70%: Check background is green
3. If 40-70%: Check background is amber
4. If <40%: Check background is red
5. Leeds should show RED (high relegation risk)
```

### Test 5: Mobile Experience
```
1. Press F12
2. Device toggle → iPhone SE (375px)
3. Verify all text readable without zooming
4. Verify touch targets are ≥44px
5. Scroll and check smooth
6. No horizontal overflow
```

### Test 6: Dark Mode
```
1. In some browsers: DevTools → Rendering → Emulate CSS media feature prefers-color-scheme
2. Select "dark"
3. Verify contrast is still good
4. Colors still readable
```

---

## Console Commands (Advanced)

Open DevTools Console (F12 → Console tab) and test:

```javascript
// Check simulation data
window.__APP_STATE__

// Verify mock data is loaded
console.log('Mock data test')

// Check React DevTools
// Install React DevTools browser extension for better debugging
```

---

## What Each Component Does

### SurvivalDisplay.jsx
- Main card showing team info and percentage
- Handles color coding based on survival percentage
- Shows team badge and name

### ProgressBar.jsx
- Visual indicator of survival chances
- Animates when percentage changes
- Color-coded to match survival tier

### LoadingSkeleton.jsx
- Shows shimmer animation while data loads
- Placeholders for content
- Disappears when real data arrives

### ErrorState.jsx
- Shows if API fails or mock data unavailable
- Red-tinted UI
- Retry button available

### App.jsx
- Root component
- Orchestrates data fetching
- Manages overall layout (header, footer, main)

---

## Troubleshooting

### "Calculating..." never finishes
```bash
# Check browser console (F12 → Console)
# Look for red error messages
# Refresh page (Cmd+R or Ctrl+R)
# If persists: pkill vite && npm run dev
```

### Layout looks broken
```bash
# Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
# Check if CSS loaded: DevTools → Sources → see CSS file
# Verify Tailwind built: Look for large CSS file
```

### Animations not smooth
```bash
# Use Chrome DevTools Performance tab
# Record 5 seconds
# Check FPS graph
# If <30fps: Computer may be slow, not app issue
```

### Badge not showing
```bash
# Check DevTools → Sources → assets/badges/leeds.svg
# If 404: Badge file missing (fallback "LEE" should show)
# If corrupted: Try deleting and regenerating: node scripts/create-placeholder-badges.js
```

### Font looks wrong
```bash
# Check: DevTools → Elements → Computed → font-family
# Should be "Inter" or system font fallback
# If Arial/generic: Font didn't load, but fallback working
```

---

## Performance Profiling

### Check Bundle Size
```bash
# In DevTools → Sources tab
# Look at Network tab
# Should see:
# - index.html: ~3 KB
# - CSS file: ~14 KB
# - JS file: ~236 KB
```

### Check Simulation Speed
```javascript
// In console:
console.time('simulation');
// Wait for simulation to complete
console.timeEnd('simulation');
// Should show: "simulation: ~300ms"
```

### Check Rendering Performance
```
1. DevTools → Performance tab
2. Click "Record"
3. Wait for percentage to animate
4. Click "Stop"
5. Look at FPS graph (should be smooth)
```

---

## Sign-Off Checklist

Before you consider testing complete, verify:

- [ ] Visual design looks professional
- [ ] All functionality works correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations are smooth
- [ ] Error handling works
- [ ] Performance is good (<2s load, <500ms simulation)
- [ ] SEO meta tags present
- [ ] Accessibility is good
- [ ] No console errors
- [ ] Mock data loads successfully

---

## Next: Prepare for Netlify Deployment

Once local testing passes:

1. Get football-data.org API key
2. Go to https://app.netlify.com
3. Follow NETLIFY_SETUP.md
4. Deploy live to survival.leedsthat.com

---

**Current Status:** ✅ Development server running
**Next Action:** Open http://localhost:5173 and start testing!
