import { useState, useRef, useEffect } from "react";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

// --- Local "AI" chat function: rules + fallbacks ---
function getDemoChatbotReply(text: string) {
  const RULES = [
    { pattern: /refill|prescription/, reply: "I can help you with your refill. Which medication?" },
    { pattern: /hello|hi|hey/, reply: "Hi! How can I help you today?" },
    { pattern: /thank/, reply: "You're welcome!" },
    { pattern: /hours|open/, reply: "We are always open, just for you." },
    { pattern: /insurance/, reply: "We accept most major insurances. Cash too!" },
    { pattern: /delivery/, reply: "Yes, we offer delivery services!" },
    { pattern: /features/, reply: "There are so many features to improve your patient care!" },
    { pattern: /medication/, reply: "Let me look that up so I can give you the best info!" },
  ];
  for (const rule of RULES) {
    if (rule.pattern.test(text.toLowerCase())) return rule.reply;
  }
  const fallback = [
    "I'm here to help! Can you clarify?",
    "Sorry, could you please rephrase?",
    "Let me check on that for you.",
    "Could you give me a few more details?"
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

type Message = {
  id: number;
  sender: "You" | "Pharmacy Staff Member";
  text: string;
};

export default function PatientChatMorphRow() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgId, setMsgId] = useState(1);
  const msgEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the newest message when it arrives
  useEffect(() => {
    if (msgEndRef.current) msgEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    const nextId = msgId;
    setMessages((msgs) => [
      ...msgs,
      { id: nextId, sender: "You", text: trimmed }
    ]);
    setMsgId((id) => id + 1);
    setInput("");
    // Demo pharmacy reply after a moment (AI logic here)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { id: nextId + 1, sender: "Pharmacy Staff Member", text: getDemoChatbotReply(trimmed) }
      ]);
      setMsgId((id) => id + 1);
    }, 700);
  }

  // Allow Enter to send
  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Layout vars
  const OUTER_WIDTH = "100%";
  const ICON_LEFT = 20;

  return (
    <div
      style={{
        position: "relative",
        width: OUTER_WIDTH,
        height: 48,
        margin: "20px 0 28px 0",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Morphing chat icon/chat window */}
      <motion.div
        layout
        initial={false}
        animate={{
          width: open ? 896 : 44,
          height: open ? 270 : 44,
          borderRadius: 4,
          background: "#fff",
          boxShadow: open
            ? "0 8px 32px #232c3d11"
            : "0 2px 8px #232c3d10",
          border: "2px solid #000000ff",
          // position: "absolute",
          // left: ICON_LEFT,
          // top: 0,
          overflow: "hidden",
          zIndex: 2,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 40
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          minWidth: 0,
          minHeight: 0,
        }}
        className={open ? undefined : "cursor-clickable"}
        onClick={() => !open && setOpen(true)}
        tabIndex={0}
      >
        <AnimatePresence initial={false}>
          {!open && (
            <motion.div
              key="icon"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.19 }}
              style={{
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdOutlineChatBubbleOutline size={30} color="rgba(238, 43, 21, 0.73)" className="cursor-clickable" />
            </motion.div>
          )}
          {open && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.07, duration: 0.3 }}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              {/* Chat header & close button */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 24px 8px 24px",
                fontWeight: 700,
                color: "#224666",
                fontSize: 18,
                borderBottom: "1.5px solid #e7edf7"
              }}>
                Patient Chat
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 22,
                    color: "#a1b3d2",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                  className="cursor-clickable"
                  aria-label="Close chat"
                  tabIndex={0}
                  type="button"
                >
                  ×
                </button>
              </div>
              {/* Message area */}
              <div
                style={{
                  flex: 1,
                  padding: "24px 28px",
                  color: "#222",
                  overflowY: "auto",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                {messages.length === 0 ? (
                  <span style={{ color: "#a1b3d2" }}>No messages yet.</span>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf:
                          msg.sender === "You" ? "flex-end" : "flex-start",
                        background:
                          msg.sender === "You"
                            ? "#e6f4ff"
                            : "#f2f6fd",
                        color: "#224666",
                        borderRadius: 8,
                        padding: "10px 18px",
                        maxWidth: 440,
                        boxShadow:
                          msg.sender === "You"
                            ? "0 2px 10px #80cdf711"
                            : "0 2px 8px #ccd1f010",
                        fontSize: 16,
                        fontWeight: 500,
                        marginBottom: 2,
                      }}
                    >
                      <span style={{ fontWeight: 600, marginRight: 6 }}>
                        {msg.sender === "You" ? "You" : "Pharmacy Staff Member"}:
                      </span>
                      {msg.text}
                    </div>
                  ))
                )}
                <div ref={msgEndRef} />
              </div>
              {/* Input area */}
              <div style={{
                padding: "12px 18px",
                borderTop: "1.5px solid #e7edf7",
                display: "flex",
                gap: 8,
                background: "#f8fafc"
              }}>
                <input
                  style={{
                    flex: 1,
                    padding: "9px 13px",
                    borderRadius: 6,
                    border: "1.5px solid #c6d7ee",
                    fontSize: 16,
                    outline: "none",
                  }}
                  placeholder="Type your message…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  autoFocus={false}
                />
                <button
                  style={{
                    background: "#224666",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "9px 22px",
                    fontSize: 16,
                    opacity: input.trim() ? 1 : 0.5
                  }}
                  className="cursor-clickable"
                  disabled={!input.trim()}
                  type="button"
                  onClick={handleSend}
                >
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Absolutely positioned text, faded out when open */}
      <motion.div
        key="outside-text"
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: 80,  // Adjusted here
          top: 0,
          height: 48,
          display: "flex",
          alignItems: "center",
          color: "#555",
          fontWeight: 400,
          fontSize: 20,
          letterSpacing: 0.01,
          lineHeight: 1.33,
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: open ? "none" : "auto",
          zIndex: 1,
        }}
      >
        Chat with your pharmacy staff or the system itself! HIPAA compliant and AI-powered.
      </motion.div>
    </div>
  );
}
