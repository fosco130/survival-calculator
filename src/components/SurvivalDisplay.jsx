import { useState, useEffect } from 'react';
import { getSurvivalColor, getThresholdLabel } from '../data/historicalThresholds';
import { getReactionForPercentage, CALCULATING_MESSAGES } from '../utils/banterMessages';
import ProgressBar from './ProgressBar';
import MonteCarloAnimation from './MonteCarloAnimation';
import './SurvivalDisplay.css';

// Import badge SVGs for all teams
const badges = import.meta.glob('../assets/badges/*.svg', { eager: true });

function SurvivalDisplay({ team, teamStanding, percentage, calculating, standings, progress = { current: 0, total: 0 } }) {
  const [displayPercentage, setDisplayPercentage] = useState(null);
  const [prevPercentage, setPrevPercentage] = useState(null);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (percentage !== null && percentage !== prevPercentage) {
      setDisplayPercentage(percentage);
      setPrevPercentage(percentage);
    }
  }, [percentage, prevPercentage]);

  // Rotate through calculating messages every 300ms
  useEffect(() => {
    if (!calculating) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % CALCULATING_MESSAGES.length);
    }, 300);

    return () => clearInterval(interval);
  }, [calculating]);

  if (!team || !teamStanding) {
    return null;
  }

  const survivalColor = displayPercentage ? getSurvivalColor(displayPercentage) : 'nervous';
  const threshold = getThresholdLabel(teamStanding.points);
  const gamesRemaining = 38 - teamStanding.playedGames;
  const reaction = displayPercentage ? getReactionForPercentage(displayPercentage) : null;

  // Calculate points needed for safety
  const pointsNeeded = Math.max(0, threshold.points - teamStanding.points);

  // Get badge SVG path
  const badgePath = `../assets/badges/${team.slug}.svg`;
  const badgeModule = badges[badgePath];
  const badgeUrl = badgeModule?.default;

  return (
    <div className="survival-display">
      {/* Team Header */}
      <div className="team-header">
        <div className="team-badge-wrapper">
          <img
            src={badgeUrl}
            alt={`${team.name} badge`}
            className="team-badge-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <div
            className="team-badge"
            style={{
              borderColor: team.colors.primary,
              boxShadow: `0 0 20px rgba(${hexToRgb(team.colors.primary).join(',')}, 0.3)`,
            }}
          >
            {team.shortName}
          </div>
        </div>
        <h2 className="team-name">{team.name}</h2>
      </div>

      {/* Main Survival Card */}
      <div
        className={`survival-card survival-card-${survivalColor}`}
        style={{
          borderLeftColor: team.colors.primary,
          '--team-glow': `rgba(${hexToRgb(team.colors.primary).join(',')}, 0.2)`,
        }}
      >
        {/* Big Percentage Number */}
        <div className="percentage-section">
          {displayPercentage !== null && !calculating ? (
            <>
              <div className={`percentage-number animated ${survivalColor}`}>
                {Math.round(displayPercentage * 10) / 10}%
              </div>
              {reaction && (
                <div className="reaction-text">
                  <span className="reaction-emoji">{reaction.emoji}</span>
                  <span className="reaction-primary">{reaction.primary}</span>
                </div>
              )}
            </>
          ) : (
            <div className="percentage-skeleton"></div>
          )}

          <p className="percentage-label">Chance of Survival</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          {displayPercentage !== null && !calculating ? (
            <ProgressBar percentage={displayPercentage} color={survivalColor} />
          ) : (
            <div className="progress-skeleton"></div>
          )}
        </div>

        {/* Context Stats */}
        <div className="context-stats">
          <div className="stat">
            <span className="stat-label">Position</span>
            <span className="stat-value">{teamStanding.position}th</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat">
            <span className="stat-label">Points</span>
            <span className="stat-value">{teamStanding.points}</span>
          </div>
          <div className="stat-divider">•</div>
          <div className="stat">
            <span className="stat-label">Games Left</span>
            <span className="stat-value">{gamesRemaining}</span>
          </div>
        </div>

        {/* Historical Threshold */}
        <div className="threshold-info">
          <p className="threshold-label">Historical Safety Threshold:</p>
          <p className="threshold-value">
            {threshold.points} pts ({Math.round(threshold.survivalRate * 100)}% safe historically)
          </p>
        </div>

        {/* What You Need */}
        {pointsNeeded > 0 && displayPercentage !== null && (
          <div className="what-you-need">
            <p className="what-you-need-label">What You Need:</p>
            <p className="what-you-need-value">
              <span className="points-needed">{pointsNeeded} points</span> from {gamesRemaining} games
            </p>
          </div>
        )}

        {/* Calculating State - Enhanced Overlay */}
        {calculating && (
          <div className="calculating-overlay">
            {/* Monte Carlo Particle Animation */}
            <MonteCarloAnimation progress={progress} />

            {/* Rotating Banter Messages */}
            <div className="calculating-messages">
              <div className="message-content">
                <div className="message-spinner">⚡</div>
                <p className="message-text">{CALCULATING_MESSAGES[messageIndex]}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [255, 205, 0]; // Default to Leeds yellow
}

export default SurvivalDisplay;
