import React, { useState } from "react";
import "./OnboardingFlow.css";

const AGE_GROUPS = [
  {
    id: "kids",
    label: "Little Explorer",
    sublabel: "Ages 4–8",
    emoji: "🧸",
    color: "#f6ad55",
    desc: "Simple, fun, animated videos",
  },
  {
    id: "elementary",
    label: "Curious Learner",
    sublabel: "Ages 8–12",
    emoji: "🔭",
    color: "#68d391",
    desc: "Interactive & story-based learning",
  },
  {
    id: "middle",
    label: "Junior Scholar",
    sublabel: "Ages 12–15",
    emoji: "⚡",
    color: "#63b3ed",
    desc: "Deeper concepts, engaging projects",
  },
  {
    id: "highschool",
    label: "High Achiever",
    sublabel: "Ages 15–18",
    emoji: "🎯",
    color: "#9f7aea",
    desc: "Advanced topics & exam prep",
  },
  {
    id: "university",
    label: "University",
    sublabel: "18+",
    emoji: "🎓",
    color: "#fc8181",
    desc: "In-depth lectures & research",
  },
  {
    id: "adult",
    label: "Lifelong Learner",
    sublabel: "Any age",
    emoji: "🌍",
    color: "#4fd1c5",
    desc: "Professional & personal growth",
  },
];

const SUBJECTS = [
  { id: "math", label: "Mathematics", emoji: "📐" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "programming", label: "Programming & CS", emoji: "💻" },
  { id: "history", label: "History", emoji: "🏛️" },
  { id: "geography", label: "Geography", emoji: "🌍" },
  { id: "literature", label: "Literature", emoji: "📖" },
  { id: "art", label: "Art & Design", emoji: "🎨" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "physics", label: "Physics", emoji: "⚛️" },
  { id: "chemistry", label: "Chemistry", emoji: "🧪" },
  { id: "biology", label: "Biology", emoji: "🧬" },
  { id: "economics", label: "Economics", emoji: "📊" },
  { id: "psychology", label: "Psychology", emoji: "🧠" },
  { id: "philosophy", label: "Philosophy", emoji: "💭" },
  { id: "languages", label: "Languages", emoji: "🗣️" },
  { id: "engineering", label: "Engineering", emoji: "⚙️" },
  { id: "medicine", label: "Medicine", emoji: "🏥" },
  { id: "business", label: "Business", emoji: "💼" },
];

function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0); // 0 = welcome, 1 = age, 2 = subjects
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (id) => {
    setSelectedSubjects(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    onComplete({
      ageGroup: selectedAge,
      subjects: selectedSubjects,
    });
  };

  return (
    <div className="onboarding-root">
      {/* Ambient orbs */}
      <div className="onb-orb onb-orb-1" />
      <div className="onb-orb onb-orb-2" />
      <div className="onb-orb onb-orb-3" />

      <div className="onboarding-container">
        {/* Progress */}
        {step > 0 && (
          <div className="onb-progress">
            {[1, 2].map(i => (
              <div key={i} className={`onb-dot ${step >= i ? "active" : ""}`} />
            ))}
          </div>
        )}

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <div className="onb-step onb-welcome" key="welcome">
            <div className="onb-logo">
              <span className="onb-logo-icon">▶</span>
              <span className="onb-logo-text">EduTube</span>
            </div>
            <h1 className="onb-headline">
              Learn Anything.<br />
              <span className="onb-gradient-text">At Any Age.</span>
            </h1>
            <p className="onb-subtext">
              AI-curated educational videos tailored to your level, interests, and goals.
              Let's set up your personal learning profile.
            </p>
            <button className="onb-btn-primary" onClick={() => setStep(1)}>
              Get Started →
            </button>
            <p className="onb-skip" onClick={handleFinish}>
              Skip setup, explore freely
            </p>
          </div>
        )}

        {/* ── STEP 1: Age Group ── */}
        {step === 1 && (
          <div className="onb-step" key="age">
            <h2 className="onb-step-title">Who's learning today?</h2>
            <p className="onb-step-sub">
              Pick the level that feels right — you can always change it later.
            </p>
            <div className="age-grid">
              {AGE_GROUPS.map(ag => (
                <button
                  key={ag.id}
                  className={`age-card ${selectedAge === ag.id ? "selected" : ""}`}
                  style={{ "--card-color": ag.color }}
                  onClick={() => setSelectedAge(ag.id)}
                >
                  <span className="age-emoji">{ag.emoji}</span>
                  <span className="age-label">{ag.label}</span>
                  <span className="age-sublabel">{ag.sublabel}</span>
                  <span className="age-desc">{ag.desc}</span>
                </button>
              ))}
            </div>
            <div className="onb-actions">
              <button className="onb-btn-ghost" onClick={() => setStep(0)}>← Back</button>
              <button
                className="onb-btn-primary"
                disabled={!selectedAge}
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Subjects ── */}
        {step === 2 && (
          <div className="onb-step" key="subjects">
            <h2 className="onb-step-title">What do you want to learn?</h2>
            <p className="onb-step-sub">
              Select your subjects — we'll prioritize these in your feed.
              <strong> Pick as many as you like.</strong>
            </p>
            <div className="subjects-grid">
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  className={`subject-chip ${selectedSubjects.includes(s.id) ? "selected" : ""}`}
                  onClick={() => toggleSubject(s.id)}
                >
                  <span className="subject-emoji">{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            <div className="onb-actions">
              <button className="onb-btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="onb-btn-primary" onClick={handleFinish}>
                {selectedSubjects.length === 0 ? "Skip & Explore" : "Start Learning 🚀"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { AGE_GROUPS, SUBJECTS };
export default OnboardingFlow;
