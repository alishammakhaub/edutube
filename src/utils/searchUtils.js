// Search query builder — combines user query, subjects, and age suffix
// into a well-formed YouTube search string.

const SUBJECT_KEYWORDS = {
  math:        "mathematics",
  science:     "science",
  programming: "programming coding",
  history:     "history",
  geography:   "geography",
  literature:  "literature english",
  art:         "art drawing",
  music:       "music theory",
  physics:     "physics",
  chemistry:   "chemistry",
  biology:     "biology",
  economics:   "economics",
  psychology:  "psychology",
  philosophy:  "philosophy",
  languages:   "language learning",
  engineering: "engineering",
  medicine:    "medicine health",
  business:    "business management",
};

const AGE_SUFFIXES = {
  kids:       "for kids",
  elementary: "for children elementary",
  middle:     "for middle school students",
  highschool: "high school tutorial",
  university: "university lecture",
  adult:      "explained",
  default:    "educational",
};

export function getAgeQuerySuffix(ageGroup) {
  return AGE_SUFFIXES[ageGroup] || AGE_SUFFIXES.default;
}

export function buildSearchQuery(userQuery, subjects, ageSuffix) {
  const parts = [];

  if (userQuery && userQuery.trim()) {
    parts.push(userQuery.trim());
  } else if (subjects.length > 0) {
    // Use subject keywords when no explicit query
    const subjectTerms = subjects
      .slice(0, 2)
      .map(s => SUBJECT_KEYWORDS[s] || s)
      .join(" ");
    parts.push(subjectTerms);
  } else {
    parts.push("educational");
  }

  // If subjects are active AND a query was typed, filter by subject context
  if (userQuery && subjects.length > 0) {
    const subjectHint = subjects.slice(0, 1).map(s => SUBJECT_KEYWORDS[s] || s)[0];
    if (subjectHint && !userQuery.toLowerCase().includes(subjectHint)) {
      parts.push(subjectHint);
    }
  }

  parts.push(ageSuffix);

  return parts.join(" ");
}
