# EduTube v2 — AI-Powered Educational Video Platform

## 🚀 Features

- **Age-Level Filtering** — 6 learning levels from Little Explorers (ages 4–8) to Lifelong Learners, each with tailored search parameters, SafeSearch settings, and trending topics.
- **Subject Filters** — 18 subject categories (Math, Physics, Programming, History, Art, Music, and more). Select multiple subjects to focus your feed.
- **Smart Search Algorithm** — Automatically combines your search query + selected subjects + age-appropriate language into an optimized YouTube API query.
- **AI Learning Assistant** — A Claude-powered chat panel that helps you discover topics, suggests learning paths, explains concepts, and gives personalized recommendations based on your profile.
- **Video Player** — In-app player with iframe embeds so you never leave the site.
- **Watch History** — Automatically tracks every video you watch (stored per session).
- **Bookmarks** — Save videos to revisit later.
- **Load More** — Paginated YouTube results with a "Load More" button.
- **Trending Topics** — Personalized trending suggestions per age group.

## 📁 Project Structure

```
src/
├── App.js                    # Root component, global state
├── reportWebVitals.js
├── setupTests.js
├── App.test.js
├── styles/
│   ├── index.css             # Global CSS variables, animations, reset
│   └── App.css               # App-level layout
├── components/
│   ├── OnboardingFlow.js/.css   # Welcome + age + subject setup
│   ├── Header.js/.css           # Fixed nav with level switcher
│   ├── Dashboard.js/.css        # Main discover page
│   ├── SearchBar.js/.css        # Search input
│   ├── AgeFilter.js/.css        # Age-level pill buttons
│   ├── SubjectFilter.js/.css    # Subject chip toggles
│   ├── VideoGrid.js/.css        # Responsive video grid
│   ├── VideoCard.js/.css        # Video card + modal player
│   ├── WatchHistory.js/.css     # History & bookmarks page
│   └── AIAssistant.js/.css      # Claude AI side panel
└── utils/
    └── searchUtils.js           # Query building algorithm
```

## 🛠 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API keys

**YouTube Data API v3 key** — in `src/components/Dashboard.js`, replace:
```js
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";
```
Get one at: https://console.cloud.google.com → Enable YouTube Data API v3

**Anthropic API key** — The AI Assistant uses `api.anthropic.com` directly. You must configure a proxy or set up an environment variable. For local dev, the simplest approach is to add a `.env` file:
```
REACT_APP_ANTHROPIC_KEY=sk-ant-...
```
Then update `AIAssistant.js`:
```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
  "anthropic-version": "2023-06-01",
}
```
> ⚠️ Never expose API keys in production builds. Use a backend proxy.

### 3. Run the app
```bash
npm start
```

## 🎨 Customization

- **Colors**: Edit CSS variables in `src/styles/index.css`
- **Age groups**: Edit `AGE_GROUPS` array in `OnboardingFlow.js`
- **Subjects**: Edit `SUBJECTS` array in `OnboardingFlow.js`
- **Trending topics**: Edit `TRENDING_BY_AGE` in `Dashboard.js`
- **Search algorithm**: Adjust `searchUtils.js`

## 📝 Notes

- All data is stored in React state (per session). For persistence, integrate localStorage or a backend.
- SafeSearch is set to `strict` for kids/elementary, `moderate` for older groups.
- The YouTube API key included in the original project has quota limits — consider using your own.
