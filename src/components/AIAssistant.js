import React, { useState, useRef, useEffect } from "react";
import { AGE_GROUPS, SUBJECTS } from "./OnboardingFlow";
import "./AIAssistant.css";

const SYSTEM_PROMPT = `You are EduTube's AI Learning Assistant — a friendly, knowledgeable tutor embedded in an educational video platform. 
You help users:
1. Discover the best topics and search queries for their learning goals
2. Explain concepts clearly at their level
3. Suggest learning paths and sequences
4. Recommend which subjects to explore
5. Answer educational questions directly

Keep responses concise, warm, and encouraging. Use emojis sparingly. When suggesting YouTube searches, format them as: **Search:** "query here"

If the user has a selected age group or subjects, tailor your language and complexity accordingly.`;

function AIAssistant({ profile, onClose, onProfileUpdate, lastSearchMeta }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: buildWelcomeMessage(profile),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const currentAge = AGE_GROUPS.find(ag => ag.id === profile.ageGroup);
    const currentSubjects = SUBJECTS.filter(s => profile.subjects?.includes(s.id));

    const contextNote = [
      currentAge ? `User level: ${currentAge.label} (${currentAge.sublabel})` : "",
      currentSubjects.length ? `Subjects of interest: ${currentSubjects.map(s => s.label).join(", ")}` : "",
      lastSearchMeta?.query ? `Last searched for: "${lastSearchMeta.query}"` : "",
    ].filter(Boolean).join(". ");

    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      history.push({ role: "user", content: text });

      const response = await fetch("https://api.anthropic.com/v1/complete", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.ANTHROPIC_API_KEY}`
  },
  body: JSON.stringify({
    model: "claude-2",
    max_tokens_to_sample: 1000,
    messages: [
      { role: "system", content: SYSTEM_PROMPT + (contextNote ? `\n\nCurrent user context: ${contextNote}` : "") },
      ...messages.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: text }
    ]
  })
});

const data = await response.json();
const reply = data.completion || "Sorry, I couldn't generate a response.";


      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I ran into an error. Please try again!",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "What should I learn first?",
    "Suggest a learning path for me",
    "Explain my last search topic simply",
    "What subjects complement each other?",
  ];

  return (
    <div className="ai-overlay" onClick={onClose}>
      <div className="ai-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="ai-header">
          <div className="ai-header-left">
            <div className="ai-avatar">✦</div>
            <div>
              <div className="ai-name">AI Learning Assistant</div>
              <div className="ai-status">
                <span className="ai-dot" />
                Powered by Claude
              </div>
            </div>
          </div>
          <button className="ai-close" onClick={onClose}>×</button>
        </div>

        {/* Messages */}
        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-msg ai-msg-${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="ai-msg-avatar">✦</div>
              )}
              <div className="ai-msg-bubble">
                <MessageContent content={msg.content} />
              </div>
            </div>
          ))}
          {loading && (
            <div className="ai-msg ai-msg-assistant">
              <div className="ai-msg-avatar">✦</div>
              <div className="ai-msg-bubble ai-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="ai-quick">
            {quickPrompts.map(q => (
              <button key={q} className="ai-quick-btn" onClick={() => { setInput(q); }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-input-row">
          <textarea
            ref={inputRef}
            className="ai-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about learning..."
            rows={1}
          />
          <button
            className="ai-send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            ↑
          </button>
        </div>
        <p className="ai-hint">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

function buildWelcomeMessage(profile) {
  const age = AGE_GROUPS.find(ag => ag.id === profile.ageGroup);
  if (age) {
    return `Hi! I'm your AI Learning Assistant 🎓 I see you're set up as a **${age.label}**. I can help you discover great topics, suggest learning paths, or explain anything you're curious about. What would you like to learn today?`;
  }
  return `Hi! I'm your AI Learning Assistant 🎓 I can help you find the perfect educational videos, suggest what to learn next, or explain any concept. What are you curious about?`;
}

// Render bold markdown and search suggestions
function MessageContent({ content }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="ai-msg-text">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </p>
  );
}

export default AIAssistant;
