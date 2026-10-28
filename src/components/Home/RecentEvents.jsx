import { useEffect, useState } from "react";
import { GenAI } from "../../lib/genai";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import { FaCircle } from "react-icons/fa";

const RecentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prompt = "Give me the latest 3 space events, each in less than 5 words. Number each event (1., 2., 3.)";
  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GenAI(prompt);

      const eventList = response.split("\n")
        .filter(line => line.trim().length > 0)
        .map((event, index) => {
          const match = event.match(/^\d+\.\s*(.+)$/);
          return match ? { 
            id: index,
            name: match[1].trim()
          } : null;
        })
        .filter(Boolean)
        .slice(0, 3);

      setEvents(eventList);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
      setEvents([
        { id: 1, name: "New Mars Rover" },
        { id: 2, name: "Lunar Mission" },
        { id: 3, name: "Asteroid Flyby" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventColor = (index) => {
    const colors = ["text-blue-400", "text-purple-400", "text-green-400"];
    return colors[index % colors.length];
  };

  return (
    <div className="mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          Recent Events
        </h4>
        <button
          onClick={fetchEvents}
          disabled={loading}
          className={`text-xs flex items-center gap-1 ${loading ? 'text-gray-500' : 'text-blue-400 hover:text-blue-300'}`}
        >
          <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} size={12} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="space-y-1">
        <AnimatePresence>
          {loading && events.length === 0 ? (
            [1, 2, 3].map((i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 py-1"
              >
                <div className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </motion.div>
            ))
          ) : (
            events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 py-1"
              >
                <FaCircle className={`text-xs ${getEventColor(i)}`} />
                <span className="text-sm text-gray-300">
                  {event.name}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mt-2 text-red-400 text-xs flex items-center gap-1">
          <FaCircle className="text-xs" /> {error}
        </div>
      )}
    </div>
  );
};

export default RecentEvents;