import React from "react";
import { AGE_GROUPS } from "./OnboardingFlow";
import "./AgeFilter.css";

function AgeFilter({ current, onChange }) {
  return (
    <div className="age-filter">
      <span className="filter-label">Level</span>
      <div className="age-filter-pills">
        {AGE_GROUPS.map(ag => (
          <button
            key={ag.id}
            className={`age-pill ${current === ag.id ? "active" : ""}`}
            style={{ "--pill-color": ag.color }}
            onClick={() => onChange(ag.id === current ? null : ag.id)}
            title={ag.desc}
          >
            <span>{ag.emoji}</span>
            <span>{ag.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AgeFilter;
