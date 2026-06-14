import React, { useState } from "react";
import "./VideoCard.css";

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

function VideoCard({ video, index, addToHistory, toggleBookmark, isBookmarked }) {
  const [showPlayer, setShowPlayer] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleWatch = () => {
    setShowPlayer(true);
    addToHistory(video);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    toggleBookmark(video);
  };

  return (
    <>
      <div
        className="video-card"
        style={{ animationDelay: `${index * 0.04}s` }}
      >
        {/* Thumbnail */}
        <div className="video-thumb" onClick={handleWatch}>
          {!imgError && video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="video-thumb-fallback">🎬</div>
          )}
          <div className="video-thumb-overlay">
            <div className="play-btn">▶</div>
          </div>
        </div>

        {/* Info */}
        <div className="video-info">
          <h3 className="video-title" onClick={handleWatch} title={video.title}>
            {video.title}
          </h3>
          <div className="video-meta">
            <span className="video-channel">{video.channel}</span>
            {video.publishedAt && (
              <span className="video-time">{timeAgo(video.publishedAt)}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="video-actions">
          <button
            className={`action-btn bookmark-btn ${isBookmarked ? "active" : ""}`}
            onClick={handleBookmark}
            title={isBookmarked ? "Remove bookmark" : "Bookmark"}
          >
            {isBookmarked ? "⊹ Saved" : "⊹ Save"}
          </button>
          <button
            className="action-btn watch-btn"
            onClick={handleWatch}
          >
            Watch ▶
          </button>
        </div>
      </div>

      {/* Player modal */}
      {showPlayer && (
        <div className="player-overlay" onClick={() => setShowPlayer(false)}>
          <div className="player-modal" onClick={e => e.stopPropagation()}>
            <div className="player-header">
              <h4 className="player-title">{video.title}</h4>
              <button className="player-close" onClick={() => setShowPlayer(false)}>×</button>
            </div>
            <div className="player-frame-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="player-meta">
              <span className="video-channel">{video.channel}</span>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="player-yt-link"
              >
                Open on YouTube ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoCard;
