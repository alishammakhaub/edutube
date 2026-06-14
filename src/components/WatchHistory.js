import React from "react";
import VideoGrid from "./VideoGrid";
import "./WatchHistory.css";

function WatchHistory({ items, title, emptyMessage, addToHistory, toggleBookmark, isBookmarked }) {
  return (
    <div className="watch-history">
      <div className="wh-header">
        <h2 className="wh-title">{title}</h2>
        <span className="wh-count">{items.length} video{items.length !== 1 ? "s" : ""}</span>
      </div>

      {items.length === 0 ? (
        <div className="wh-empty">
          <span className="empty-icon">📭</span>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <VideoGrid
          videos={items}
          loading={false}
          addToHistory={addToHistory}
          toggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked}
        />
      )}
    </div>
  );
}

export default WatchHistory;
