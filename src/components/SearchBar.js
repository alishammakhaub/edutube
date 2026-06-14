import React, { useRef } from "react";
import "./SearchBar.css";

function SearchBar({ value, onChange, onSearch, placeholder }) {
  const inputRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === "Enter" && value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="searchbar">
      <span className="searchbar-icon">⌕</span>
      <input
        ref={inputRef}
        className="searchbar-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder || "Search any topic..."}
        autoComplete="off"
      />
      {value && (
        <button className="searchbar-clear" onClick={handleClear} title="Clear">×</button>
      )}
      <button
        className="searchbar-btn"
        onClick={() => value.trim() && onSearch(value.trim())}
        disabled={!value.trim()}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;
