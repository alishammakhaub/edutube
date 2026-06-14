import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SubjectFilter from "./SubjectFilter";
import AgeFilter from "./AgeFilter";
import VideoGrid from "./VideoGrid";
import SearchBar from "./SearchBar";
import { buildSearchQuery, getAgeQuerySuffix } from "../utils/searchUtils";
import "./Dashboard.css";

const YOUTUBE_API_KEY = "AIzaSyBeAqGbNeyv0emaiM0QJtoFAlc0hyrAWU0";

// Trending topics per age group for initial suggestions
const TRENDING_BY_AGE = {
  kids:       ["animals for kids", "how things work", "drawing for kids", "fun science experiments", "fairy tales"],
  elementary: ["solar system", "dinosaurs", "volcanoes", "coding basics for kids", "world geography"],
  middle:     ["algebra explained", "climate change", "history of civilizations", "intro to physics", "writing skills"],
  highschool: ["calculus tutorial", "SAT prep", "AP biology", "world history", "Python programming"],
  university: ["machine learning", "quantum physics", "microeconomics", "organic chemistry", "philosophy of mind"],
  adult:      ["financial literacy", "productivity systems", "data science", "leadership skills", "language learning"],
  default:    ["science", "math", "history", "programming", "art"],
};

function Dashboard({
  profile, onProfileUpdate,
  videos, setVideos,
  loading, setLoading,
  lastSearchMeta, setLastSearchMeta,
  addToHistory, toggleBookmark, isBookmarked
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubjects, setActiveSubjects] = useState(profile.subjects || []);
  const [pageToken, setPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);

  // Sync subjects from profile
  useEffect(() => {
    setActiveSubjects(profile.subjects || []);
  }, [profile.subjects]);

  const fetchVideos = useCallback(async (query, token = null) => {
    setLoading(true);
    setError(null);

    const ageSuffix = getAgeQuerySuffix(profile.ageGroup);
    const finalQuery = buildSearchQuery(query, activeSubjects, ageSuffix);

    try {
      const params = {
        part: "snippet",
        q: finalQuery,
        type: "video",
        maxResults: 12,
        videoCategoryId: "27", // Education category
        relevanceLanguage: "en",
        key: YOUTUBE_API_KEY,
        safeSearch: profile.ageGroup === "kids" || profile.ageGroup === "elementary" ? "strict" : "moderate",
      };
      if (token) params.pageToken = token;

      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", { params });

      const items = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
      }));

      if (token) {
        setVideos(prev => [...prev, ...items]);
      } else {
        setVideos(items);
      }

      setPageToken(response.data.nextPageToken || null);
      setHasMore(!!response.data.nextPageToken);
      setLastSearchMeta({ query: finalQuery, ageGroup: profile.ageGroup, subjects: activeSubjects });
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Could not load videos. Check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  }, [profile.ageGroup, activeSubjects, setLoading, setVideos, setLastSearchMeta]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    setPageToken(null);
    fetchVideos(q);
  }, [fetchVideos]);

  const handleSubjectChange = useCallback((subjects) => {
    setActiveSubjects(subjects);
    onProfileUpdate({ subjects });
  }, [onProfileUpdate]);

  const handleLoadMore = () => fetchVideos(searchQuery, pageToken);

  const handleTrending = (topic) => {
    setSearchQuery(topic);
    fetchVideos(topic);
  };

  const trendingTopics = TRENDING_BY_AGE[profile.ageGroup] || TRENDING_BY_AGE.default;

  return (
    <div className="dashboard">
      {/* Hero search area */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <h1 className="hero-title">
          
          </h1>
         
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            placeholder={
              activeSubjects.length > 0
                ? `Search in ${activeSubjects.slice(0, 2).join(", ")}...`
                : "Search any topic..."
            }
          />

       {/* Trending suggestions */}
          <div className="trending-row">
            <span className="trending-label">Trending:</span>
            {trendingTopics.map(t => (
              <button key={t} className="trending-chip" onClick={() => handleTrending(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="filters-bar">
        <AgeFilter
          current={profile.ageGroup}
          onChange={(ag) => onProfileUpdate({ ageGroup: ag })}
        />
        <div className="filters-divider" />
        <SubjectFilter
          active={activeSubjects}
          onChange={handleSubjectChange}
        />
      </div>

      {/* Results */}
      <div className="dashboard-results">
        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        {!loading && videos.length === 0 && !error && (
          <div className="empty-state">
            <span className="empty-icon">🎓</span>
            <h3>Ready to learn something new?</h3>
            <p>Search a topic above or click a trending suggestion to get started.</p>
          </div>
        )}

        {videos.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-count">
                {lastSearchMeta && (
                  <>Showing results for <strong>"{lastSearchMeta.query}"</strong></>
                )}
              </span>
            </div>

            <VideoGrid
              videos={videos}
              loading={loading}
              addToHistory={addToHistory}
              toggleBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
            />

            {hasMore && (
              <div className="load-more-wrap">
                <button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
                  {loading ? "Loading…" : "Load More Videos"}
                </button>
              </div>
            )}
          </>
        )}

        {loading && videos.length === 0 && (
          <div className="skeleton-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-thumb shimmer" />
                <div className="skeleton-line shimmer" style={{ width: "85%" }} />
                <div className="skeleton-line shimmer" style={{ width: "60%" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
