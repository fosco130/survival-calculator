import { useMemo } from 'react';
import './MonteCarloAnimation.css';

/**
 * Monte Carlo Particle Animation
 * Visualizes the 10,000 simulation iterations as particles
 * 50% green (survival outcomes) + 50% red (relegation outcomes)
 * GPU-accelerated with CSS transforms only
 */
function MonteCarloAnimation({ progress }) {
  // Generate 100 particles (50 green survival, 50 red relegation)
  const particles = useMemo(() => {
    const particleArray = [];

    // 50 green particles (survival)
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: `green-${i}`,
        type: 'survive',
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        endX: Math.random() * 100,
        endY: Math.random() * 20, // Fly upward
        delay: Math.random() * 0.3,
        duration: 1.2 + Math.random() * 0.4,
      });
    }

    // 50 red particles (relegation)
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: `red-${i}`,
        type: 'relegate',
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        endX: Math.random() * 100,
        endY: 80 + Math.random() * 20, // Fly downward
        delay: Math.random() * 0.3,
        duration: 1.2 + Math.random() * 0.4,
      });
    }

    return particleArray;
  }, []);

  // Calculate what percentage of particles to show based on progress
  const visibleCount = useMemo(() => {
    if (!progress || progress.total === 0) return 0;
    const percentage = (progress.current / progress.total);
    return Math.floor(particles.length * percentage);
  }, [progress, particles.length]);

  return (
    <div className="monte-carlo-animation">
      {/* Background glow effect */}
      <div className="animation-glow"></div>

      {/* Particle container */}
      <div className="particles-container">
        {particles.map((particle, index) => (
          <div
            key={particle.id}
            className={`particle particle-${particle.type} ${
              index < visibleCount ? 'particle-visible' : ''
            }`}
            style={{
              '--start-x': `${particle.startX}%`,
              '--start-y': `${particle.startY}%`,
              '--end-x': `${particle.endX}%`,
              '--end-y': `${particle.endY}%`,
              '--delay': `${particle.delay}s`,
              '--duration': `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="animation-legend">
        <div className="legend-item">
          <div className="legend-dot legend-survive"></div>
          <span className="legend-label">Survival outcomes</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-relegate"></div>
          <span className="legend-label">Relegation outcomes</span>
        </div>
      </div>

      {/* Progress indicator */}
      {progress && progress.total > 0 && (
        <div className="animation-progress">
          <div className="progress-counter">
            {progress.current.toLocaleString()} / {progress.total.toLocaleString()}
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MonteCarloAnimation;
