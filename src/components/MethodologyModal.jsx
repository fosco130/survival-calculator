import { useState } from 'react';
import './MethodologyModal.css';

function MethodologyModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('what');

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'what',
      title: 'What is this?',
      icon: '❓',
      content: (
        <>
          <p>
            This tool calculates your team's Premier League survival odds using historical data and Monte Carlo simulation.
          </p>
          <p>
            Instead of guessing, we run <strong>10,000 simulated seasons</strong> from your current position to see how many times your team stays up.
          </p>
          <p>
            <strong>Why it matters:</strong> Early in the season, small changes (a win here, a loss there) can dramatically swing your odds. This tool shows you exactly how resilient your position is.
          </p>
        </>
      ),
    },
    {
      id: 'how',
      title: 'How we predict',
      icon: '🧮',
      content: (
        <>
          <h4>The Monte Carlo Method</h4>
          <p>
            We simulate the rest of your season 10,000 times:
          </p>
          <ol>
            <li><strong>Current State:</strong> We take your team's current points, position, and games played</li>
            <li><strong>Random Outcomes:</strong> For each remaining fixture, we simulate a win/draw/loss based on historical probability</li>
            <li><strong>Final Points:</strong> We calculate your final points total</li>
            <li><strong>Survival Check:</strong> Did you get enough points to stay up historically?</li>
            <li><strong>Count Wins:</strong> Out of 10,000 simulations, how many times did you survive?</li>
          </ol>
          <p>
            <strong>The result:</strong> Your survival percentage = (Times survived / 10,000) × 100%
          </p>
        </>
      ),
    },
    {
      id: 'why',
      title: 'Why trust it?',
      icon: '✅',
      content: (
        <>
          <p>
            <strong>Historical accuracy:</strong> Our safety threshold is based on 20 years of Premier League history. We calculated what points total keeps you up 92% of the time.
          </p>
          <p>
            <strong>Unbiased math:</strong> The simulation doesn't care about your team - it's pure probability based on historical patterns.
          </p>
          <p>
            <strong>Real-time updates:</strong> As fixtures happen, your odds update instantly to reflect your actual position.
          </p>
          <p>
            <strong>Conservative estimate:</strong> This assumes remaining fixtures are 50/50 random. Great teams will overperform; struggling teams may underperform.
          </p>
        </>
      ),
    },
    {
      id: 'affects',
      title: 'What affects odds?',
      icon: '📊',
      content: (
        <>
          <p>
            <strong>Current Points:</strong> More points = higher survival odds (obvious!)
          </p>
          <p>
            <strong>Games Remaining:</strong> More games left = more chances to gain points. Early season, anything can change.
          </p>
          <p>
            <strong>Historical Threshold:</strong> The points total that keeps you up historically (usually ~35 pts)
          </p>
          <p>
            <strong>Position:</strong> Lower position looks scarier but what matters is points gap to safety.
          </p>
          <p>
            <strong>What we DON'T factor in:</strong> Injuries, form, managerial changes, transfer activity. Use judgment alongside these odds.
          </p>
        </>
      ),
    },
    {
      id: 'limits',
      title: 'Limitations',
      icon: '⚠️',
      content: (
        <>
          <p>
            <strong>Assumes randomness:</strong> Real football isn't random - great teams win more. These odds assume 50/50 fixtures.
          </p>
          <p>
            <strong>Historical data:</strong> Based on past 20 years. Premier League evolves - relegation battles might be different now.
          </p>
          <p>
            <strong>No player knowledge:</strong> Can't account for injuries, form dips, or tactical changes.
          </p>
          <p>
            <strong>Quality matters:</strong> A 95% odds doesn't mean the team is good - just that they're unlikely to go down given historical patterns.
          </p>
          <p>
            <strong>Use as guide, not gospel:</strong> These are probability estimates, not guarantees. Anomalies happen every season.
          </p>
        </>
      ),
    },
  ];

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="methodology-modal-overlay" onClick={onClose}>
      <div className="methodology-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="methodology-header">
          <h2>How Does This Work?</h2>
          <button className="methodology-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="methodology-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`methodology-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.title}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="methodology-content">
          <div className="content-section">
            <h3>{activeTabContent.title}</h3>
            {activeTabContent.content}
          </div>
        </div>

        {/* Footer */}
        <div className="methodology-footer">
          <p>
            Questions? Check out{' '}
            <a href="https://leedsthat.com" target="_blank" rel="noopener noreferrer">
              Leeds, That!
            </a>{' '}
            for more football analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MethodologyModal;
