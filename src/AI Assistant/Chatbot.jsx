import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSend,
  FiX,
  FiMessageSquare,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { spaceKeywords } from "./spaceKeywords.js";
import Fuse from "fuse.js";
import { GiAstronautHelmet } from "react-icons/gi";

const fuse = new Fuse(spaceKeywords, {
  includeScore: true,
  threshold: 0.4,
  distance: 100,
  findAllMatches: true, // Allow partial matches
  useExtendedSearch: true, // Improves multi-word search
  keys: ["word"], // Search each keyword
});

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI Space Assistant. Ask me anything about space, galaxies, or astronomy!",
      sender: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateResponse = async () => {
    if (!query.trim()) return;

    const words = query.toLowerCase().split(" "); // Split query into words
    const isSpaceRelated = words.some((word) => fuse.search(word).length > 0);

    if (!isSpaceRelated) {
      setMessages((prev) => [
        ...prev,
        {
          text: "I specialize in space-related topics only. Please ask about astronomy, planets, galaxies, or space exploration.",
          sender: "bot",
          isWarning: true,
        },
      ]);
      setQuery("");
      return;
    }

    setLoading(true);
    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setQuery("");

    try {
      const res = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA3IwJ5B1e3evOO9i_2rzCE2JA3jNSJYM4",
        {
          contents: [
            {
              parts: [
                {
                  text: `You are an expert space science assistant. Answer concisely and accurately in simple terms: ${query}`,
                },
              ],
            },
          ],
        }
      );

      const botReply =
        res.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't find an answer to that space question.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting to the space knowledge database. Please try again later.",
          sender: "bot",
          isError: true,
        },
      ]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateResponse();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
        >
          <GiAstronautHelmet className="text-3xl" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className={`w-[26rem] bg-gray-800/80 rounded-xl shadow-2xl border border-gray-700 overflow-hidden ${
              isMinimized ? "h-20" : ""
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500 p-2 rounded-full">
                  <GiAstronautHelmet className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-blue-300">
                  Space AI Assistant
                </h2>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <FiArrowUp /> : <FiArrowDown />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-900/50">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-xl ${
                        msg.sender === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                          : msg.isWarning
                          ? "bg-gradient-to-br from-amber-600 to-amber-500 text-white"
                          : msg.isError
                          ? "bg-gradient-to-br from-red-600 to-red-500 text-white"
                          : "bg-gradient-to-br from-gray-700 to-gray-600 text-white"
                      } shadow-md`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white p-3 rounded-xl flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Area */}
            {!isMinimized && (
              <div className="p-4 bg-gray-900 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ask about space..."
                    disabled={loading}
                  />
                  <motion.button
                    onClick={generateResponse}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-3 rounded-lg flex items-center justify-center disabled:opacity-50"
                    disabled={loading || !query.trim()}
                  >
                    <FiSend />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Ask about planets, stars, galaxies, or space missions
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
