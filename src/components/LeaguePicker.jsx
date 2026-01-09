import { useState } from 'react';
import './LeaguePicker.css';

const LEAGUES = [
  { code: 'PL', name: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'ELC', name: 'Championship', emoji: '🏆' },
  { code: 'EL1', name: 'League One', emoji: '⚽' },
  { code: 'EL2', name: 'League Two', emoji: '🎯' },
];

function LeaguePicker({ selectedLeague, onLeagueChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = LEAGUES.find(l => l.code === selectedLeague);

  return (
    <div className="league-picker">
      <button
        className="league-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="league-emoji">{selected?.emoji}</span>
        <span className="league-name">{selected?.name}</span>
        <span className="league-chevron">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="league-dropdown">
          {LEAGUES.map(league => (
            <button
              key={league.code}
              className={`league-option ${league.code === selectedLeague ? 'active' : ''}`}
              onClick={() => {
                onLeagueChange(league.code);
                setIsOpen(false);
              }}
            >
              <span className="league-emoji">{league.emoji}</span>
              <span className="league-name">{league.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaguePicker;
