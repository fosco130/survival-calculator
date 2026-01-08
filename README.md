# Premier League Survival Calculator

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

A sporty, data-driven web application that calculates any Premier League team's probability of avoiding relegation using Monte Carlo simulation.

**Live Demo:** https://survival.leedsthat.com
**GitHub:** https://github.com/YOUR_USERNAME/survival-calculator

---

## Features

✨ **Monte Carlo Simulation**
- 10,000 iteration statistical analysis
- Points Per Game (50%) + Recent Form (30%) weighting
- Home advantage factor (0.1 multiplier)
- <500ms calculation time

🎨 **Bold Sporty Design**
- Dark navy-black theme (#0A0E1A)
- Color-coded survival tiers (Green >70%, Amber 40-70%, Red <40%)
- Animated percentage numbers with count-up effect
- Responsive mobile-first layout
- CSS-only animations (no JavaScript libraries)

📊 **Live Premier League Data**
- Real standings from football-data.org API
- 1-hour caching via Netlify Functions
- Automatic fixture simulation
- Historical survival thresholds

🚀 **Performance**
- 71 KB gzipped bundle size
- <2 second page load on 4G
- Simulation runs in browser (no server overhead)
- Netlify serverless infrastructure

🎯 **SEO Optimized**
- Comprehensive meta tags
- Open Graph sharing support
- Twitter Card integration
- Schema.org structured data
- Robots.txt and sitemap

---

## Getting Started

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/survival-calculator.git
cd survival-calculator

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# For development (with mock data):
echo "VITE_USE_MOCK_DATA=true" >> .env.local

# For production (with real API):
# Add your football-data.org API key:
echo "VITE_FOOTBALL_DATA_API_KEY=your_api_key_here" >> .env.local
```

### Development

```bash
# Start dev server (http://localhost:5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Local Testing

The app includes mock Premier League data for development testing without API keys:

```bash
# Already enabled in .env.local
# Simulates real API responses with 300ms delay
```

---

## Project Structure

```
survival-calculator/
├── src/
│   ├── components/          # React UI components
│   │   ├── App.jsx         # Root component
│   │   ├── SurvivalDisplay.jsx  # Main card
│   │   ├── ProgressBar.jsx  # Progress indicator
│   │   ├── LoadingSkeleton.jsx  # Loading state
│   │   └── ErrorState.jsx   # Error handling
│   ├── data/               # Static data & constants
│   │   ├── teams.js        # 20 PL teams with colors
│   │   ├── constants.js    # Simulation parameters
│   │   ├── historicalThresholds.js  # Points data
│   │   └── mockData.js     # Development testing data
│   ├── hooks/              # React data hooks
│   │   ├── useStandings.js # Fetch standings
│   │   ├── useFixtures.js  # Fetch fixtures
│   │   └── useSimulation.js # Run simulation
│   ├── lib/                # Core logic
│   │   ├── simulation.js   # Monte Carlo algorithm
│   │   ├── teamStrength.js # Strength calculation
│   │   └── matchSimulation.js  # Match outcomes
│   └── assets/badges/      # 20 team SVG badges
├── netlify/functions/      # Serverless API endpoints
│   ├── get-standings.js    # Cached standings API
│   └── get-fixtures.js     # Cached fixtures API
├── public/                 # Static assets
│   ├── robots.txt         # Search engine directives
│   └── sitemap.xml        # URL sitemap
├── scripts/                # Utility scripts
│   └── create-placeholder-badges.js  # Generate badges
└── netlify.toml           # Netlify configuration
```

---

## How It Works

### 1. Data Collection
- Fetches current Premier League standings
- Retrieves remaining fixtures for the season
- Caches data for 1 hour to optimize API usage

### 2. Strength Calculation
```javascript
const ppg = team.points / team.playedGames;  // 50% weight
const form = team.last6Points / 18;          // 30% weight
const strength = ppg * 0.5 + form * 0.3;
```

### 3. Match Simulation
- For each remaining fixture:
  - Calculates probability based on team strength
  - Applies home advantage factor (0.1)
  - Randomly determines result (win/draw/loss)
  - Updates table standings

### 4. Survival Analysis
- Runs 10,000 simulations
- Counts scenarios where team finishes 17th or higher
- Returns: (survivalCount / 10000) * 100 = **Survival %**

### 5. Color Coding
- **Green (>70%):** Safe from relegation
- **Amber (40-70%):** Competitive battle
- **Red (<40%):** High relegation risk

---

## Configuration

### Environment Variables

**Development (.env.local):**
```bash
VITE_FOOTBALL_DATA_API_KEY=dev_key
VITE_USE_MOCK_DATA=true
```

**Production (Netlify):**
```bash
FOOTBALL_DATA_API_KEY=your_real_api_key
```

### API Key Setup

1. Sign up at [football-data.org](https://www.football-data.org/)
2. Navigate to "API Token" section
3. Copy your 40-character API key
4. Add to Netlify environment variables
5. Redeploy site

---

## Technology Stack

| Purpose | Technology | Version |
|---------|-----------|---------|
| UI Framework | React | 19.x |
| Build Tool | Vite | 7.x |
| Styling | Tailwind CSS | 4.x |
| Hosting | Netlify | - |
| Serverless | Netlify Functions | - |
| API Source | football-data.org | v4 |

**Bundle Size Breakdown:**
- HTML: 2.83 KB (gzipped: 0.93 KB)
- CSS: 14.35 KB (gzipped: 3.34 KB)
- JS: 235.77 KB (gzipped: 67.87 KB)
- **Total: 252.95 KB (71.14 KB gzipped)**

---

## Performance Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Build Time | <1s | 563ms ✅ |
| Simulation Time | <500ms | ~300ms ✅ |
| Bundle Size (gzipped) | <100KB | 71KB ✅ |
| Lighthouse Performance | >85 | ~92 ✅ |
| Lighthouse SEO | >95 | ~96 ✅ |
| Page Load (4G) | <2s | 1.2s ✅ |

---

## Deployment

### Quick Deploy to Netlify

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/survival-calculator.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Import from Git"
   - Select your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `FOOTBALL_DATA_API_KEY`

3. **Configure Domain:**
   - Add custom domain: `survival.leedsthat.com`
   - Create CNAME in DNS pointing to Netlify
   - Wait for SSL certificate (automatic)

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.**

---

## Development Roadmap

### Phase 1 ✅ (Complete)
- Leeds United calculator
- Monte Carlo simulation (10k iterations)
- Dark sporty UI
- Netlify deployment

### Phase 2 🎯 (Planned)
- Multi-team support (`?team=leicester`)
- Team selector UI
- Scenario builder (W/D/L toggles)
- Dynamic Open Graph sharing

### Phase 3 📈 (Planned)
- xG integration (Understat data)
- Improved strength weighting
- Scheduled data updates

### Phase 4 🚀 (Planned)
- Share buttons (Twitter, Facebook)
- Advanced animations
- Mobile performance optimization
- Analytics integration

---

## Testing

### Automated Unit Tests

Comprehensive unit tests for critical business logic using Vitest:

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Coverage (Phase 1):**
- **Statements:** 99.81% (target: 80%) ✅
- **Functions:** 100% (target: 80%) ✅
- **Branches:** 94.64% (target: 75%) ✅
- **Lines:** 99.81% (target: 80%) ✅

**Test Suites:**
- ✅ `simulation.test.js` - Monte Carlo engine (31 tests)
- ✅ `matchSimulation.test.js` - Match outcome probabilities (24 tests)
- ✅ `teamStrength.test.js` - Strength calculation (29 tests)
- ✅ `teams.test.js` - Team registry & utilities (27 tests)
- ✅ `historicalThresholds.test.js` - Thresholds & color coding (41 tests)

**Total: 152 passing tests with deterministic seeded random for Monte Carlo validation**

### Manual Testing

```bash
# Development server with mock data
npm run dev
# Visit http://localhost:5173

# Build verification
npm run build
# Check dist/ folder is populated

# Production preview
npm run preview
# Test build locally
```

### Test Coverage

- ✅ Monte Carlo simulation accuracy & edge cases
- ✅ Match probability distribution with home advantage
- ✅ Team strength weighting (PPG + form)
- ✅ Data utility functions & lookups
- ✅ Historical thresholds & color mapping
- ✅ Error handling & fallback behaviors

See [PHASE1_TESTING.md](./PHASE1_TESTING.md) for full testing report.

---

## Contributing

Contributions welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## Troubleshooting

### "API key not found" Error
→ Check Netlify environment variables are set correctly

### Simulation Not Calculating
→ Check browser console (F12) for errors
→ Verify mock data is working locally

### DNS Not Resolving
→ Wait 60+ minutes for DNS propagation
→ Verify CNAME record in DNS provider settings

**See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) troubleshooting section for more help.**

---

## Credits & Attribution

- **Data Source:** [football-data.org](https://www.football-data.org/)
- **Hosting:** [Netlify](https://www.netlify.com/)
- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Design Philosophy:** Sporty/energetic with bold team colors

---

## License

MIT License - see LICENSE file for details

---

## Contact & Feedback

- **Project Issues:** Create an [issue](https://github.com/YOUR_USERNAME/survival-calculator/issues)
- **Feedback:** Submit via email to james@leedsthat.com
- **Follow:** [@leedsthat](https://twitter.com/leedsthat)

---

## Quick Links

- 📖 [PHASE1_TESTING.md](./PHASE1_TESTING.md) - Testing & validation report
- 🚀 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- 🔑 [.env.example](./.env.example) - Environment variable template
- 📋 [netlify.toml](./netlify.toml) - Netlify configuration

---

**Status:** ✅ Phase 1 Complete | 🎯 Ready for Deployment | 📈 Phase 2 Planning

*Last updated: 2026-01-08*
