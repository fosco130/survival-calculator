# Netlify Deployment Checklist

**Repository:** https://github.com/fosco130/survival-calculator
**Status:** ✅ Code pushed to GitHub, ready for Netlify connection

---

## Step 1: Connect GitHub to Netlify (5 minutes)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** as deployment method
4. Authorize Netlify to access your GitHub
5. Select repository: `fosco130/survival-calculator`
6. Click **"Import"**

---

## Step 2: Configure Build Settings (2 minutes)

In Netlify's build configuration screen, ensure:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

Click **"Deploy site"** to proceed.

---

## Step 3: Add Environment Variable (3 minutes)

While the first build is running (takes ~2-3 minutes):

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Add environment variables"**
3. Add new variable:
   - **Key:** `FOOTBALL_DATA_API_KEY`
   - **Value:** [Your API key from football-data.org]
4. Click **"Save"**

**Need an API key?**
- Sign up at https://www.football-data.org/
- Go to "API Token" section
- Copy your 40-character token
- Paste in Netlify

---

## Step 4: Configure Custom Domain (5 minutes)

After the initial build completes:

1. Go to **Site Settings** → **Domain Management**
2. Click **"Add custom domain"**
3. Enter: `survival.leedsthat.com`
4. Click **"Continue"**
5. Netlify will provide a **CNAME target** (e.g., `[site-id].netlify.com`)
6. **Copy this value** - you'll need it for DNS

---

## Step 5: Update DNS Records (3 minutes)

Go to your DNS provider (Squarespace, Hover, etc.):

1. Find DNS settings for `leedsthat.com`
2. Create a new **CNAME record:**
   - **Host/Name:** `survival`
   - **Points to:** `[netlify-cname-target-from-step-4]`
   - **TTL:** 3600 (1 hour)
3. Save changes

**Example:**
```
Host: survival
Points to: foo-bar-123.netlify.com
TTL: 3600
```

---

## Step 6: Wait for DNS & SSL (10-60 minutes)

- DNS propagation: 5-60 minutes (usually 15 minutes)
- SSL certificate: Automatic via Let's Encrypt (5-15 minutes after DNS resolves)
- You can check progress in Netlify: Site Settings → Domain Management

**Verify DNS is working:**
```bash
nslookup survival.leedsthat.com
# Should return Netlify's nameserver
```

---

## Step 7: Test Live Site (5 minutes)

Once DNS resolves (check URL bar for 🔒 lock icon):

1. Visit https://survival.leedsthat.com
2. Verify Leeds United data loads
3. Check survival percentage displays correctly
4. Test on mobile device
5. Verify animations are smooth
6. Check browser console for errors (F12)

---

## Troubleshooting

### Build Failed
- Check Netlify build logs: Site Settings → Deploy log
- Verify `npm run build` works locally: `cd /Users/james/Dev\ Projects/Survival/survival-calculator && npm run build`

### API Key Error
- Verify key is set: Netlify → Site Settings → Environment
- Redeploy: Click "Trigger deploy" → "Deploy site"

### DNS Not Resolving
- Wait 60+ minutes (DNS propagation)
- Verify CNAME record in DNS provider
- Check Netlify domain settings match your DNS configuration

### HTTPS Certificate Error
- Wait 15 minutes after DNS resolves
- Force refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache

---

## Post-Deployment Monitoring

### Weekly
- [ ] Site loads without errors
- [ ] Simulation calculates correctly
- [ ] No console errors (F12)

### Monitor Deployment Logs
```bash
netlify logs
```

### Check Function Calls
```bash
netlify functions:list
```

---

## Quick Links

- 📊 Netlify Dashboard: https://app.netlify.com/
- 🔑 football-data.org API: https://www.football-data.org/
- 📖 Netlify Docs: https://docs.netlify.com/
- 🚀 Your Repo: https://github.com/fosco130/survival-calculator

---

## Status Checklist

- [x] GitHub repository created
- [x] Code pushed to GitHub
- [ ] Netlify site connected to GitHub
- [ ] Build settings configured
- [ ] Environment variable added (FOOTBALL_DATA_API_KEY)
- [ ] Custom domain added (survival.leedsthat.com)
- [ ] DNS CNAME record created
- [ ] SSL certificate generated
- [ ] Site tested and verified live

---

**Next Action:** Go to https://app.netlify.com and follow the checklist above!
