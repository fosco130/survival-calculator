import https from 'https';
import fs from 'fs';
import path from 'path';

// Premier League team badges with their official Wikimedia Commons URLs
const teamBadges = {
  arsenal: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  aston_villa: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Aston_Villa_FC.svg',
  bournemouth: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth.svg',
  brentford: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Brentford_FC.svg',
  brighton: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_and_Hove_Albion_FC.svg',
  chelsea: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  crystal_palace: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Crystal_Palace_FC_logo.svg',
  everton: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg',
  fulham: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
  ipswich: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Ipswich_Town_FC.svg',
  leicester: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_FC_logo.svg',
  liverpool: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  manchester_city: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  manchester_united: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_badge.svg',
  newcastle: 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg',
  nottingham_forest: 'https://upload.wikimedia.org/wikipedia/en/e/e4/Nottingham_Forest_FC_logo.svg',
  southampton: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
  tottenham: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg',
  west_ham: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United.svg',
  wolverhampton: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers_FC_Badge.svg',
  leeds: 'https://upload.wikimedia.org/wikipedia/en/5/5a/Leeds_United_FC.svg',
};

const badgeDir = path.join(process.cwd(), 'src/assets/badges');

// Ensure directory exists
if (!fs.existsSync(badgeDir)) {
  fs.mkdirSync(badgeDir, { recursive: true });
}

// Download each badge
async function downloadBadge(team, url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadBadge(team, response.headers.location).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${team}: ${response.statusCode}`));
        return;
      }

      const filePath = path.join(badgeDir, `${team}.svg`);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✓ Downloaded ${team}`);
        resolve();
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Download all badges
async function downloadAllBadges() {
  console.log('Downloading Premier League team badges...\n');

  for (const [team, url] of Object.entries(teamBadges)) {
    try {
      await downloadBadge(team, url);
    } catch (error) {
      console.error(`✗ Failed to download ${team}: ${error.message}`);
    }
  }

  console.log('\n✓ Badge download complete!');
}

downloadAllBadges().catch(console.error);
