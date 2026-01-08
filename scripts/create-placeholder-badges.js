import fs from 'fs';
import path from 'path';
import { teams } from '../src/data/teams.js';

const badgeDir = path.join(process.cwd(), 'src/assets/badges');

// Ensure directory exists
if (!fs.existsSync(badgeDir)) {
  fs.mkdirSync(badgeDir, { recursive: true });
}

// Create SVG badge template
function createBadgeSVG(teamName, primaryColor, secondaryColor) {
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Background shield shape -->
  <defs>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="3" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Shield -->
  <path d="M 100 20 L 170 50 L 170 110 Q 100 180 100 180 Q 100 180 30 110 L 30 50 Z"
        fill="${primaryColor}" filter="url(#shadow)"/>

  <!-- Secondary color accent -->
  <path d="M 100 40 L 155 65 L 155 105 Q 100 160 100 160 Q 100 160 45 105 L 45 65 Z"
        fill="${secondaryColor}"/>

  <!-- Team initials circle -->
  <circle cx="100" cy="95" r="25" fill="${primaryColor}" opacity="0.9"/>
  <circle cx="100" cy="95" r="20" fill="white"/>

  <!-- Text placeholder -->
  <text x="100" y="102" font-size="14" font-weight="bold" text-anchor="middle" fill="${primaryColor}">
    ${teamName.substring(0, 3).toUpperCase()}
  </text>
</svg>`;
}

// Create badges for all teams
console.log(`Creating placeholder badges for ${teams.length} teams...\n`);

let successCount = 0;
teams.forEach(team => {
  try {
    const badgeSVG = createBadgeSVG(
      team.name,
      team.colors.primary,
      team.colors.secondary
    );
    const filePath = path.join(badgeDir, `${team.slug}.svg`);
    fs.writeFileSync(filePath, badgeSVG);
    console.log(`✓ Created ${team.slug}.svg`);
    successCount++;
  } catch (error) {
    console.error(`✗ Failed to create ${team.slug}: ${error.message}`);
  }
});

console.log(`\n✓ Created ${successCount} placeholder badges!`);
console.log('\nNote: These are placeholder SVGs for development testing.');
console.log('Replace with official team badges from your design team or sports data providers.');
