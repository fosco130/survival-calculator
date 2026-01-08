/**
 * Banter Message System
 * Provides personality and contextual messaging throughout the app
 */

export const SURVIVAL_REACTIONS = {
  ELITE: {
    // 95-100%
    primary: "You're laughing!",
    secondary: "Safe as houses, mate",
    emoji: "☕",
    vibe: "confident",
  },
  COMFORTABLE: {
    // 75-94%
    primary: "Should be alright, lad",
    secondary: "Looking good from here",
    emoji: "😌",
    vibe: "relaxed",
  },
  NERVOUS: {
    // 50-74%
    primary: "Squeaky bum time",
    secondary: "Proper nervous one this",
    emoji: "😰",
    vibe: "tense",
  },
  DANGER: {
    // 25-49%
    primary: "Danger zone, mate",
    secondary: "Time to panic",
    emoji: "🚨",
    vibe: "panic",
  },
  DOOMED: {
    // 0-24%
    primary: "Start planning for the Championship",
    secondary: "Proper in the mud",
    emoji: "💀",
    vibe: "doomed",
  },
};

export const CALCULATING_MESSAGES = [
  "Crunching the numbers...",
  "Consulting the xG gods...",
  "Running the algorithms...",
  "Asking the Magic 8-Ball...",
  "Checking the fixtures...",
  "Simulating every scenario...",
  "Doing the maths so you don't have to...",
  "Rolling the dice 10,000 times...",
  "Reading the tea leaves...",
  "Calling in the experts...",
  "Feeding the superstitions...",
  "Talking to the football gods...",
];

/**
 * Get survival reaction based on percentage
 * @param {number} percentage - Survival percentage (0-100)
 * @returns {object} Reaction object with primary, secondary, emoji, vibe
 */
export function getReactionForPercentage(percentage) {
  if (percentage >= 95) return SURVIVAL_REACTIONS.ELITE;
  if (percentage >= 75) return SURVIVAL_REACTIONS.COMFORTABLE;
  if (percentage >= 50) return SURVIVAL_REACTIONS.NERVOUS;
  if (percentage >= 25) return SURVIVAL_REACTIONS.DANGER;
  return SURVIVAL_REACTIONS.DOOMED;
}

/**
 * Get random calculating message
 * @returns {string} Random calculating message
 */
export function getRandomCalculatingMessage() {
  return CALCULATING_MESSAGES[Math.floor(Math.random() * CALCULATING_MESSAGES.length)];
}

/**
 * Generate dynamic share text based on team situation
 * @param {object} team - Team object
 * @param {number} percentage - Survival percentage
 * @param {object} rival - Optional rival team for comparison
 * @param {number} rivalPercentage - Optional rival survival percentage
 * @returns {string} Share text
 */
export function getShareText(team, percentage, rival = null, rivalPercentage = null) {
  const teamName = team?.name || "Your team";
  const percentageStr = percentage ? percentage.toFixed(1) : "??";
  const reaction = getReactionForPercentage(percentage);

  // Comparison format (when rival is selected)
  if (rival && rivalPercentage !== null) {
    const rivalName = rival?.name || "Rival";
    const rivalPctStr = rivalPercentage.toFixed(1);

    // Big flex - we're way safer than rival
    if (percentage > rivalPercentage + 30) {
      return `${teamName} are ${percentageStr}% safe from the drop 😤

Meanwhile ${rivalName} are SWEATING at ${rivalPctStr}%... 📉

Check your team's odds 👇`;
    }

    // Rival is way safer - panic mode
    if (rivalPercentage > percentage + 30) {
      return `${teamName} are ${percentageStr}% to survive.

But ${rivalName}? They're ${rivalPctStr}% safe.

Not the same 🔴

survival.leedsthat.com`;
    }

    // Close call
    return `The battle for survival is CLOSE:

${teamName}: ${percentageStr}%
${rivalName}: ${rivalPctStr}%

Who's going down? 🎯

survival.leedsthat.com`;
  }

  // Standard format (single team)
  if (percentage < 25) {
    // Panic mode
    return `${teamName} fans, it's time to PANIC 🚨

Only ${percentageStr}% survival chance.
The drop is coming for you 💀

Run the scenarios at survival.leedsthat.com`;
  }

  if (percentage < 50) {
    // Danger zone
    return `${teamName} are in the DANGER ZONE 🚨

${percentageStr}% survival chance left.

Test your scenarios 👇
survival.leedsthat.com`;
  }

  if (percentage >= 95) {
    // Safe celebration
    return `${teamName} are ${percentageStr}% SAFE! ☕

You're laughing while others panic.

Check everyone else's odds 👇
survival.leedsthat.com`;
  }

  // Default - comfortable/nervous
  return `${teamName} have a ${percentageStr}% chance of Premier League survival 🎯

${reaction.primary} ${reaction.emoji}

Check your team's odds 👇
survival.leedsthat.com`;
}
