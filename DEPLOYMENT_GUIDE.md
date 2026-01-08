# Deployment Guide - Premier League Survival Calculator

**Project:** survival.leedsthat.com
**Environment:** Netlify (serverless)
**Domain:** subdomain of leedsthat.com
**Status:** Ready for deployment

---

## Pre-Deployment Checklist

### ✅ Code Ready
- [x] Phase 1 implementation complete
- [x] Git repository initialized
- [x] Initial commit created
- [x] All 62 files tracked
- [x] `.gitignore` configured (excludes node_modules, .env, dist)
- [x] Build verified (no errors)

### ⏳ Before Proceeding
- [ ] GitHub account access confirmed
- [ ] Netlify account access confirmed
- [ ] API key from football-data.org obtained
- [ ] DNS access to leedsthat.com confirmed

---

## Step-by-Step Deployment

### 1. Create GitHub Repository

**Option A: GitHub Web Interface**
1. Go to https://github.com/new
2. Create new repository: `survival-calculator`
3. Choose settings:
   - Visibility: Public (for portfolio/resume)
   - Don't initialize with README (we have one)
4. Click "Create repository"

**Option B: GitHub CLI**
```bash
gh repo create survival-calculator --public --source=. --remote=origin --push
```

### 2. Push Code to GitHub

```bash
cd /Users/james/Dev\ Projects/Survival/survival-calculator

# Set remote origin to your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/survival-calculator.git
git branch -M main
git push -u origin main
```

**Expected Output:**
```
Enumerating objects: 62, done.
Counting objects: 100% (62/62), done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### 3. Get Football Data API Key

**Sign Up for football-data.org**
1. Visit https://www.football-data.org/
2. Register for free account
3. Navigate to "API Token" section
4. Copy your API key (40-character token)
5. Free tier: 10 requests/minute, sufficient for this use case

### 4. Connect to Netlify

**Method 1: Netlify Web Interface (Recommended)**

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Select GitHub as deployment method
4. Authorize GitHub access
5. Select your `survival-calculator` repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
7. Add environment variables:
   - Click "Advanced" → "New variable"
   - Add: `FOOTBALL_DATA_API_KEY` = `[your_api_key]`

**Deploy:** Click "Deploy site"

### 5. Configure Custom Domain

**In Netlify Dashboard:**

1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter: `survival.leedsthat.com`
4. Netlify will show DNS configuration instructions:
   - **CNAME target:** Something like `[random]-[random].netlify.com`
   - Copy this value

**In Your DNS Provider (e.g., Squarespace, Hover, etc.):**

1. Log into your domain registrar
2. Find DNS settings for `leedsthat.com`
3. Create new CNAME record:
   - **Host:** `survival`
   - **Points to:** `[netlify-cname-target]`
   - **TTL:** 3600 (1 hour)
4. Save

**Verify DNS Propagation:**
```bash
# Wait 5-60 minutes for DNS to propagate, then:
nslookup survival.leedsthat.com

# Should return Netlify's nameserver
```

### 6. SSL Certificate Setup

**Automatic (Recommended)**
- Netlify automatically provisions free SSL via Let's Encrypt
- This happens when you add custom domain
- Wait 5-15 minutes for certificate generation
- HTTPS becomes available automatically

**Manual Verification:**
```bash
curl -I https://survival.leedsthat.com
# Should show: HTTP/2 200
```

### 7. Environment Configuration

**Set in Netlify:**
1. Site Settings → Build & Deploy → Environment
2. Add variables:
   ```
   FOOTBALL_DATA_API_KEY = [your_api_key]
   ```

**For Local Development:**
Create `.env.local` (not committed):
```bash
VITE_FOOTBALL_DATA_API_KEY=your_api_key_here
VITE_USE_MOCK_DATA=false
```

---

## Post-Deployment Testing

### ✅ Smoke Tests

1. **Access the site:**
   ```bash
   # Test live domain
   curl -I https://survival.leedsthat.com

   # Expected: HTTP/2 200
   ```

2. **Check functionality:**
   - [ ] Visit https://survival.leedsthat.com
   - [ ] Leeds United loads with data
   - [ ] Survival percentage displays (should be 15-45%)
   - [ ] Progress bar shows color coding
   - [ ] Team badge renders correctly
   - [ ] Context stats display (Position, Points, Games Left)
   - [ ] No console errors (F12 → Console)

3. **Responsive testing:**
   - [ ] Test on mobile (375px width)
   - [ ] Test on tablet (768px width)
   - [ ] Test on desktop (1920px width)
   - [ ] Verify percentage scales correctly

4. **SEO verification:**
   - [ ] Check meta tags: `curl https://survival.leedsthat.com | grep -A2 "<meta"`
   - [ ] Verify Open Graph: `<meta property="og:title"`
   - [ ] Check robots.txt: https://survival.leedsthat.com/robots.txt
   - [ ] Check sitemap: https://survival.leedsthat.com/sitemap.xml

5. **API integration:**
   - [ ] Simulation completes within 500ms
   - [ ] Data updates correctly
   - [ ] Error handling works (turn off API key to test)
   - [ ] Fallback UI displays on error

### 🔍 Performance Testing

**Use Google Lighthouse:**
1. Open Chrome DevTools (F12)
2. Click Lighthouse tab
3. Run audit
4. Target scores:
   - Performance: >85
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >95

**Expected Results:**
- Core Web Vitals: Good
- Largest Contentful Paint: <2s
- Cumulative Layout Shift: <0.1
- First Input Delay: <100ms

---

## Continuous Deployment

**Auto-Deployment Enabled:**
- Any push to `main` branch → automatic build & deploy
- Builds typically complete in 1-2 minutes
- Check deployment status: Netlify dashboard → Deploy log

**Monitor Deployments:**
```bash
# View recent deployments
netlify deploy --list

# View build logs
netlify logs
```

---

## Troubleshooting

### "API key not found" Error

**Problem:** Netlify Functions throw FOOTBALL_DATA_API_KEY error

**Solution:**
1. Verify variable in Netlify dashboard:
   - Site Settings → Build & Deploy → Environment
2. Rebuild and redeploy:
   - Go to Netlify dashboard
   - Click "Trigger deploy" → "Deploy site"
3. Check function logs:
   ```bash
   netlify functions:list
   netlify logs
   ```

### DNS Not Resolving

**Problem:** `survival.leedsthat.com` doesn't work

**Solution:**
1. Wait 60+ minutes (DNS propagation)
2. Verify CNAME in DNS provider:
   ```bash
   dig survival.leedsthat.com CNAME
   ```
3. Check Netlify domain settings are correct
4. Flush local DNS cache:
   ```bash
   # macOS
   dscacheutil -flushcache

   # Linux
   systemd-resolve --flush-caches
   ```

### HTTPS Certificate Not Working

**Problem:** Browser shows "Not Secure" or certificate error

**Solution:**
1. Wait 15 minutes after adding custom domain
2. Force refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Clear browser cache
4. Check Netlify SSL certificate status:
   - Site Settings → Domain Management
   - Should show "Netlify DNS" with green checkmark

### Simulation Not Calculating

**Problem:** Percentage shows as `--` or "Calculating..." never completes

**Solution:**
1. Check browser console for errors (F12)
2. Verify API key is set (if not using mock data)
3. Check Netlify function logs:
   ```bash
   netlify logs
   ```
4. Test mock data fallback:
   - Add to `.env`: `VITE_USE_MOCK_DATA=true`
   - Redeploy

---

## Rollback Procedure

If deployment has critical issues:

**Rollback to Previous Deployment:**
1. Netlify Dashboard → Deploy log
2. Find previous successful deployment
3. Click "Publish deploy"
4. Site reverts in <1 minute

**Rollback via Git:**
```bash
git revert HEAD
git push origin main
# Netlify auto-builds and deploys
```

---

## Monitoring & Maintenance

### Weekly Checks
- [ ] Verify site loads at survival.leedsthat.com
- [ ] Check Netlify analytics dashboard
- [ ] Review function logs for errors
- [ ] Monitor API call counts (football-data.org)

### Monthly Tasks
- [ ] Update badge SVGs with official logos
- [ ] Review performance metrics
- [ ] Plan Phase 2 features
- [ ] Check for dependency updates

### Quarterly Review
- [ ] Update simulation algorithm if needed
- [ ] Review xG integration plans
- [ ] Plan Phase 3 implementation
- [ ] Analyze user metrics

---

## Phase 1 Deployment Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Code | ✅ Ready | Committed to Git |
| Build | ✅ Ready | 71KB gzipped |
| Netlify | ⏳ Configure | Connect GitHub repo |
| API Key | ⏳ Required | From football-data.org |
| Domain | ⏳ Setup | DNS CNAME to Netlify |
| SSL | ⏳ Auto-provision | After domain added |
| Environment | ⏳ Configure | FOOTBALL_DATA_API_KEY |
| Testing | ⏳ Post-deploy | Smoke tests required |

---

## Next Steps (Phase 2+)

After Phase 1 deployment is live and verified:

1. **Phase 2: Multi-Team Support**
   - URL parameter handling (`?team=leicester`)
   - Team selector UI
   - Scenario builder

2. **Phase 3: xG Integration**
   - Understat data scraping
   - Improved simulation accuracy
   - Scheduled function updates

3. **Phase 4: Social Features**
   - Share buttons
   - Dynamic Open Graph
   - Analytics integration

---

## Support & Documentation

- **Netlify Docs:** https://docs.netlify.com/
- **Football Data API:** https://www.football-data.org/
- **Vite Guide:** https://vitejs.dev/guide/
- **React Docs:** https://react.dev/

---

**Deployment Status:** ✅ **READY TO DEPLOY**
**Last Updated:** 2026-01-08
