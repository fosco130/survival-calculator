import { useState } from 'react';
import { getShareText } from '../utils/banterMessages';
import './ShareButtons.css';

function ShareButtons({ team, percentage }) {
  const [copied, setCopied] = useState(false);

  if (!team || percentage === null) {
    return null;
  }

  const percentageStr = Math.round(percentage * 10) / 10;
  const currentUrl = window.location.href;

  // Use dynamic share text from banter system
  const shareText = getShareText(team, percentageStr);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  return (
    <div className="share-buttons">
      <div className="share-header">
        <h3 className="share-title">RATIO YOUR RIVALS</h3>
        <p className="share-subtitle">Talk your talk</p>
      </div>

      <div className="share-buttons-group">
        <button
          className="share-btn share-copy"
          onClick={handleCopyLink}
          title="Copy link to clipboard"
        >
          <span className="share-icon">🔗</span>
          <span className="share-text">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

        <button
          className="share-btn share-twitter"
          onClick={handleTwitterShare}
          title="Share on Twitter/X"
        >
          <span className="share-icon">𝕏</span>
          <span className="share-text">Tweet</span>
        </button>

        <button
          className="share-btn share-facebook"
          onClick={handleFacebookShare}
          title="Share on Facebook"
        >
          <span className="share-icon">f</span>
          <span className="share-text">Facebook</span>
        </button>
      </div>

      <div className="share-info">
        <p className="share-text-preview">
          "{team.name} have a {percentageStr}% chance of Premier League survival!"
        </p>
      </div>
    </div>
  );
}

export default ShareButtons;
