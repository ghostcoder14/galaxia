
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SpaceAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your AI Space Assistant. Ask me anything about space, galaxies, or astronomy!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isOpen]);

  async function handleSend(e) {
    e?.preventDefault();

    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/space-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "I couldn't find an answer. Try again!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to the Space AI service. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Space AI Assistant"
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-[78px] right-0 flex h-[493px]
              max-h-[calc(100dvh-110px)] w-[416px] max-w-[calc(100vw-32px)]
              flex-col overflow-hidden rounded-xl border border-slate-700
              bg-[#141d2b] text-gray-100 shadow-2xl"
          >
            {/* Header */}
            <header className="flex min-h-16 items-center justify-between
              border-b border-slate-700/70 bg-[#182335] px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center
                  rounded-full bg-blue-500 text-lg">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="7" />
                    <path d="M9 10h6v5H9zM5 9 3 7m16 2 2-2M7 18l-2 2m12-2 2 2" />
                  </svg>
                </div>

                <h2 className="text-lg font-bold text-blue-300">
                  Space AI Assistant
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Minimize assistant"
                  className="text-2xl leading-none text-slate-400
                    transition hover:text-white"
                >
                  ⌄
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close assistant"
                  className="text-2xl leading-none text-slate-400
                    transition hover:text-white"
                >
                  ×
                </button>
              </div>
            </header>

            {/* Chat messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto
              p-4 [scrollbar-width:thin] [scrollbar-color:#475569_transparent]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`max-w-[90%] whitespace-pre-wrap
                    break-words rounded-xl px-3 py-3 text-[15px]
                    leading-6 ${
                      message.role === "user"
                        ? "self-end rounded-br-sm bg-blue-700 text-white"
                        : "self-start rounded-bl-sm bg-slate-600 text-gray-100"
                    }`}
                >
                  {message.text}
                </div>
              ))}

              {loading && (
                <div className="self-start rounded-xl bg-slate-600
                  px-3 py-3 text-sm text-blue-200">
                  <span className="animate-pulse">
                    Exploring the universe...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-slate-700 bg-gray-900 p-4"
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about space..."
                  aria-label="Ask the Space AI Assistant"
                  className="h-[50px] min-w-0 flex-1 rounded-lg
                    border border-slate-600 bg-slate-700 px-3
                    text-sm text-white outline-none transition
                    placeholder:text-gray-400
                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-[50px] w-10 shrink-0 items-center
                    justify-center rounded-lg bg-blue-700 text-white
                    transition hover:bg-blue-600
                    disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      d="m22 2-7 20-4-9-9-4Z"
                      strokeLinejoin="round"
                    />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>

              <p className="mt-2.5 text-[11px] text-slate-500">
                Ask about planets, stars, galaxies, or space missions
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating astronaut button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? "Close Space AI Assistant" : "Open Space AI Assistant"}
        aria-expanded={isOpen}
        className="flex h-[62px] w-[62px] items-center justify-center
          rounded-full bg-gradient-to-br from-blue-600 to-indigo-700
          text-white shadow-lg shadow-blue-600/25
          transition-shadow hover:shadow-blue-500/50"
      >
        {isOpen ? (
          <span className="text-4xl leading-none">×</span>
        ) : (
          <svg
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-9 w-9"
            aria-hidden="true"
          >
            <path d="M13 17a7 7 0 0 1 14 0v8H13z" />
            <path d="M10 18v7m20-7v7M13 28l-4 3m18-3 4 3M16 28v3h8v-3" strokeLinecap="round" />
            <circle cx="20" cy="18" r="4" />
            <path d="m15 9-3-3m13 3 3-3M10 27h20" strokeLinecap="round" />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
