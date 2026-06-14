import React, { useState, useCallback } from "react";
import Header from "./components/Header";
//import OnboardingFlow from "./components/OnboardingFlow";
import Dashboard from "./components/Dashboard";
//import VideoGrid from "./components/VideoGrid";
import AIAssistant from "./components/AIAssistant";
import WatchHistory from "./components/WatchHistory";
import "./styles/App.css";

const DEFAULT_PROFILE = {
  ageGroup: null,       // 'kids' | 'elementary' | 'middle' | 'highschool' | 'university' | 'adult'
  subjects: [],         // selected subject tags
  searchQuery: "",
  watchHistory: [],
  bookmarks: [],
  aiRecommendations: [],
};

function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [activeTab, setActiveTab] = useState("discover"); // 'discover' | 'history' | 'bookmarks'
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [lastSearchMeta, setLastSearchMeta] = useState(null);

  const handleOnboardingComplete = useCallback((completedProfile) => {
    setProfile(prev => ({ ...prev, ...completedProfile }));
    setOnboardingDone(true);
  }, []);

  const handleProfileUpdate = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const addToHistory = useCallback((video) => {
    setProfile(prev => {
      const exists = prev.watchHistory.find(v => v.id === video.id);
      if (exists) return prev;
      return {
        ...prev,
        watchHistory: [video, ...prev.watchHistory].slice(0, 50),
      };
    });
  }, []);

  const toggleBookmark = useCallback((video) => {
    setProfile(prev => {
      const exists = prev.bookmarks.find(v => v.id === video.id);
      return {
        ...prev,
        bookmarks: exists
          ? prev.bookmarks.filter(v => v.id !== video.id)
          : [video, ...prev.bookmarks],
      };
    });
  }, []);

  const isBookmarked = useCallback((id) => {
    return profile.bookmarks.some(v => v.id === id);
  }, [profile.bookmarks]);

  /*if (!onboardingDone) {
    return (
      <div className="app-root">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }*/

  return (
    <div className="app-root">
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProfileUpdate={handleProfileUpdate}
        onOpenAI={() => setShowAI(true)}
      />

      <main className="app-main">
        {activeTab === "discover" && (
          <Dashboard
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            videos={videos}
            setVideos={setVideos}
            loading={loading}
            setLoading={setLoading}
            lastSearchMeta={lastSearchMeta}
            setLastSearchMeta={setLastSearchMeta}
            addToHistory={addToHistory}
            toggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === "history" && (
          <WatchHistory
            items={profile.watchHistory}
            title="Watch History"
            emptyMessage="Videos you watch will appear here."
            addToHistory={addToHistory}
            toggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === "bookmarks" && (
          <WatchHistory
            items={profile.bookmarks}
            title="Saved Videos"
            emptyMessage="Bookmark videos to save them for later."
            addToHistory={addToHistory}
            toggleBookmark={toggleBookmark}
            isBookmarked={isBookmarked}
          />
        )}
      </main>

      {showAI && (
        <AIAssistant
          profile={profile}
          onClose={() => setShowAI(false)}
          onProfileUpdate={handleProfileUpdate}
          lastSearchMeta={lastSearchMeta}
        />
      )}
    </div>
  );
}

export default App;
