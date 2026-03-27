import React, { useEffect, useRef, useState } from "react";
import { createPortal } from 'react-dom';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m your FAQ assistant 🤖. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // 🧠 Predefined FAQs
  const faqData = [
    {
      q: ["hello", "hi", "hey"],
      a: "Hello there 👋! How can I assist you today?",
    },
    {
      q: ["what is your name", "who are you"],
      a: "I'm your friendly FAQ bot! I can answer common questions about our platform.",
    },
    {
      q: ["how to create an account", "sign up", "register"],
      a: "To create an account, click on the 'Sign Up' button on the top right and fill in your details. ✅",
    },
    {
      q: ["how to reset password", "forgot password"],
      a: "You can reset your password by clicking on 'Forgot Password' at the login page and following the instructions 🔐.",
    },
    {
      q: ["contact", "support", "help"],
      a: "You can contact support at support@example.com or visit our 'Contact Us' page 📩.",
    },
    {
      q: ["features", "what can you do"],
      a: "Our platform helps users manage their tasks efficiently, track progress, and collaborate in real-time. 🚀",
    },
    {
      q: ["bye", "goodbye", "see you"],
      a: "Goodbye! Have a great day 👋",
    },
  ];

  // 💡 Suggested questions
  const suggestedQuestions = [
    "How to create an account?",
    "How to reset password?",
    "What are your features?",
    "How to contact support?",
  ];

  // 🔍 Find best answer
  const findAnswer = (userInput) => {
    const input = userInput.toLowerCase();
    for (let item of faqData) {
      if (item.q.some((keyword) => input.includes(keyword))) {
        return item.a;
      }
    }
    return "Sorry, I don’t have an answer for that yet. Please try asking something else. 🙏";
  };

  const handleSend = (customInput) => {
    const text = customInput || input;
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botReply = findAnswer(text);
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setLoading(false);
    }, 700);
  };

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, open]);

  const ui = (
    <>
      {/* Local styles for animations and look */}
      <style>{`
        .faqbot-fab {
          position: fixed;
          right: calc(14px + env(safe-area-inset-right, 0px));
          bottom: calc(14px + env(safe-area-inset-bottom, 0px));
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: linear-gradient(135deg,#22c55e,#14b8a6);
          color: white;
          border: none;
          box-shadow: 0 10px 24px rgba(20,184,166,0.35);
          display: grid;
          place-items: center;
          cursor: pointer;
          z-index: 2147483647; /* ensure above any app header */
          transition: transform .15s ease, box-shadow .2s ease;
          outline: none;
        }
        .faqbot-fab:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(20,184,166,0.45); }
        .faqbot-fab:active { transform: translateY(0); }
        .faqbot-fab-pulse { animation: faqbot-pulse 2.2s infinite; }
        @keyframes faqbot-pulse { 0%{box-shadow:0 0 0 0 rgba(20,184,166,.35)} 70%{box-shadow:0 0 0 14px rgba(20,184,166,0)} 100%{box-shadow:0 0 0 0 rgba(20,184,166,0)} }

        .faqbot-panel-wrap {
          position: fixed;
          right: calc(8px + env(safe-area-inset-right, 0px));
          bottom: calc(82px + env(safe-area-inset-bottom, 0px));
          width: 360px;
          max-width: calc(100vw - 16px);
          z-index: 2147483647;
        }
        .faqbot-enter {
          animation: faqbot-pop .22s cubic-bezier(.2,.8,.2,1) both, faqbot-fade .22s ease both;
          transform-origin: 100% 100%;
        }
        @keyframes faqbot-pop { from { transform: translateY(8px) scale(.96); } to { transform: translateY(0) scale(1); } }
        @keyframes faqbot-fade { from { opacity: 0 } to { opacity: 1 } }

        @media (max-width: 767px) {
          .faqbot-fab {
            display: none !important;
          }
          .faqbot-fab {
            right: 10px !important;
            bottom: 12px !important;
            width: 52px;
            height: 52px;
          }
          .faqbot-panel-wrap {
            right: 8px !important;
            left: 8px !important;
            bottom: 70px !important;
            width: auto;
            max-width: none;
          }
          .faqbot-fab,
          .faqbot-fab:hover,
          .faqbot-fab:active {
            transform: none;
            box-shadow: 0 8px 16px rgba(20,184,166,0.22);
          }
          .faqbot-fab-pulse,
          .faqbot-enter {
            animation: none !important;
          }
        }
      `}</style>

      {/* Floating Chat Window */}
      {open && (
        <div className="faqbot-panel-wrap">
          <div
            className="faqbot-enter"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                background: "linear-gradient(90deg,#22c55e,#14b8a6)",
                color: "white",
                fontWeight: 600,
              }}
            >
              FAQ Bot
              <button onClick={() => setOpen(false)} style={{ opacity: 0.9, color: "white", background: "transparent", border: 0, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            {/* Messages */}
            <div ref={scrollRef}
              style={{
                maxHeight: "52vh",
                minHeight: 240,
                overflowY: "auto",
                padding: 12,
                background: "#fff",
              }}
            >
              {messages.map((msg, i) => (
                <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "8px 0" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: msg.sender === "user" ? "#01a7c2" : "#e8faf7",
                      color: msg.sender === "user" ? "white" : "#0f5132",
                      padding: "8px 12px",
                      borderRadius: 12,
                      maxWidth: "82%",
                      wordWrap: "break-word",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              {loading && <div style={{ textAlign: "left", color: "#666" }}>Typing…</div>}
            </div>

            {/* Suggestions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 12px", background: "#f7fdfa", borderTop: "1px solid #e6f4ef" }}>
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => handleSend(q)}
                  style={{
                    background: "#e8faf7",
                    color: "#0f766e",
                    border: "1px solid #94f2c0",
                    borderRadius: 9999,
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: ".85rem",
                  }}
                >{q}</button>
              ))}
            </div>

            {/* Composer */}
            <div style={{ display: "flex", gap: 8, padding: 10, background: "#ffffffd9", borderTop: "1px solid #eef2f0" }}>
              <input
                type="text"
                placeholder="Type your question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{ flex: 1, padding: "10px 12px", border: "1px solid #dce7e2", borderRadius: 10 }}
              />
              <button onClick={() => handleSend()}
                style={{ background: "linear-gradient(135deg,#22c55e,#14b8a6)", color: "white", border: 0, padding: "10px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className={`faqbot-fab ${open ? '' : 'faqbot-fab-pulse'}`} onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close FAQ Bot' : 'Open FAQ Bot'}>
        {/* Chat icon */}
        {!open ? (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12c0 3.866-3.806 7-8.5 7-.87 0-1.709-.11-2.495-.315L4 20l1.45-3.05C4.54 15.88 4 14.49 4 13c0-3.866 3.806-7 8.5-7S21 8.134 21 12Z" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.75 12h6.5M8.75 9.5h6.5M8.75 14.5h3.5" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6l12 12M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>
    </>
  );

  // Render via portal to avoid clipping by parent containers (e.g., header/nav with transforms)
  return createPortal(ui, document.body);
};

export default ChatBot;
