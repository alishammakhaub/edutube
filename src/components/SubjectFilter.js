import React, { useState } from "react";
import { SUBJECTS } from "./OnboardingFlow";
import "./SubjectFilter.css";

function SubjectFilter({ active, onChange }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = (id) => {
    const next = active.includes(id)
      ? active.filter(s => s !== id)
      : [...active, id];
    onChange(next);
  };

  const clearAll = () => onChange([]);

  const visible = expanded ? SUBJECTS : SUBJECTS.slice(0, 8);

  return (
    <div className="subject-filter">
      <div className="subject-filter-header">
        <span className="filter-label">Subjects</span>
        {active.length > 0 && (
          <button className="subject-clear" onClick={clearAll}>
            Clear ({active.length})
          </button>
        )}
      </div>
      <div className="subject-filter-chips">
        {visible.map(s => (
          <button
            key={s.id}
            className={`sf-chip ${active.includes(s.id) ? "active" : ""}`}
            onClick={() => toggle(s.id)}
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
        <button className="sf-expand" onClick={() => setExpanded(e => !e)}>
          {expanded ? "Show less ↑" : `+${SUBJECTS.length - 8} more`}
        </button>
      </div>
    </div>
  );
}

export default SubjectFilter;
