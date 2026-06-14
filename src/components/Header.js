import React, { useState } from "react";
import { AGE_GROUPS } from "./OnboardingFlow";
import "./Header.css";

const TAB_ICONS = {
  discover: "✦",
  history: "⏱",
  bookmarks: "⊹",
};

function Header({ profile, activeTab, setActiveTab, onProfileUpdate, onOpenAI }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const currentAge = AGE_GROUPS.find(ag => ag.id === profile.ageGroup);

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <span className="header-logo-icon">▶</span>
        <span className="header-logo-text">EduTube</span>
      </div>

      {/* Nav tabs */}
      <nav className="header-nav">
        {["discover", "history", "bookmarks"].map(tab => (
          <button
            key={tab}
            className={`header-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon">{TAB_ICONS[tab]}</span>
            <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </nav>

      {/* Right side */}
      <div className="header-right">
        {/* AI button */}
        <button className="header-ai-btn" onClick={onOpenAI} title="AI Learning Assistant">
          <span className="ai-btn-icon">✦</span>
          <span>Ask AI</span>
        </button>

        {/* Profile badge */}
        <div className="header-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <span className="profile-emoji">{currentAge?.emoji ?? "🎓"}</span>
          <span className="profile-label">{currentAge?.label ?? "Learner"}</span>
          <span className="profile-caret">▾</span>

          {showProfileMenu && (
            <div className="profile-dropdown" onClick={e => e.stopPropagation()}>
              <p className="dropdown-title">Switch Level</p>
              {AGE_GROUPS.map(ag => (
                <button
                  key={ag.id}
                  className={`dropdown-item ${profile.ageGroup === ag.id ? "active" : ""}`}
                  onClick={() => {
                    onProfileUpdate({ ageGroup: ag.id });
                    setShowProfileMenu(false);
                  }}
                >
                  <span>{ag.emoji}</span>
                  <span>{ag.label}</span>
                  <span className="dropdown-sub">{ag.sublabel}</span>
                </button>
              ))}
              <div className="dropdown-divider" />
              <button
                className="dropdown-item"
                onClick={() => {
                  onProfileUpdate({ ageGroup: null, subjects: [] });
                  setShowProfileMenu(false);
                }}
              >
                <span>↺</span>
                <span>Reset Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
