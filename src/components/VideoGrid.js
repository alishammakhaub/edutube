import React from "react";
import VideoCard from "./VideoCard";
import "./VideoGrid.css";

function VideoGrid({ videos, loading, addToHistory, toggleBookmark, isBookmarked }) {
  return (
    <div className={`video-grid ${loading ? "loading" : ""}`}>
      {videos.map((video, i) => (
        <VideoCard
          key={video.id}
          video={video}
          index={i}
          addToHistory={addToHistory}
          toggleBookmark={toggleBookmark}
          isBookmarked={isBookmarked(video.id)}
        />
      ))}
    </div>
  );
}

export default VideoGrid;
