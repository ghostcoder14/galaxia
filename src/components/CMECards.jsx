import { motion } from "framer-motion";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const dateObj = new Date(timeStr);
  return dateObj.toLocaleString();
};

export default function CMECards({ events = [] }) {
  return (
    <div className="p-6 z-50 max-w-7xl mx-auto">
      {/* Animated Gradient Title */}
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-8"
        style={{
          background: "linear-gradient(90deg, #f59e0b, #ef4444, #d946ef)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          backgroundSize: "200% auto",
          animation: "gradient 3s ease infinite"
        }}
      >
        Recent Coronal Mass Ejections (CME) 🌞
      </motion.h2>

      {/* Glowing Info Box */}
      <div className="relative p-4 mb-8 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-purple-500/10 opacity-30"></div>
        <h3 className="relative z-10 text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
          Understanding CME Data
        </h3>
        <ul className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 text-sm">
          {[
            "Start Time: When the CME was first observed",
            "Impact: Locations affected by the CME",
            "Velocity: Speed in kilometers per second (km/s)",
            "Glancing Blow: Partial vs direct impact"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="inline-block w-1.5 h-1.5 mt-1.5 bg-yellow-400 rounded-full flex-shrink-0"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {events.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="inline-block px-6 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-400">
            No CME events detected
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const analysis = event.cmeAnalyses?.[0];
            const enlil = analysis?.enlilList?.[0];
            const impacts = enlil?.impactList || [];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.2)"
                }}
                className="relative bg-gray-900 text-white rounded-xl p-5 border border-gray-700 hover:border-yellow-400/30 transition-all group overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Card Header */}
                <div className="relative z-10 flex items-center gap-4 border-b border-gray-700 pb-3 mb-3">
                  <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                    <RocketLaunchIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-50">
                    CME Event {index + 1}
                  </h3>
                </div>

                {/* Key Data - Now in a clean table-like layout */}
                <div className="relative z-10 space-y-3 text-sm">
                  {[
                    { label: "Catalog", value: event.catalog, highlight: true },
                    { label: "Start Time", value: formatTime(event.startTime) },
                    { label: "Velocity", value: analysis?.speed ? `${analysis.speed} km/s` : "N/A", color: "text-blue-300" }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-400">{item.label}:</span>
                      <span className={`font-medium ${item.highlight ? "text-yellow-100" : ""} ${item.color || ""}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Impact Visualization */}
                {impacts.length > 0 ? (
                  <div className="relative z-10 mt-4 pt-3 border-t border-gray-700">
                    <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Impact Zones</h4>
                    <ul className="space-y-3">
                      {impacts.map((impact, i) => (
                        <motion.li 
                          key={i}
                          whileHover={{ x: 5 }}
                          className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-yellow-400"
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-gray-400">Location:</span>
                            <span className="font-medium">{impact.location}</span>
                            
                            <span className="text-gray-400">Arrival:</span>
                            <span>{formatTime(impact.arrivalTime)}</span>
                            
                            <span className="text-gray-400">Glancing:</span>
                            <span className={impact.isGlancingBlow ? "text-orange-300" : "text-green-300"}>
                              {impact.isGlancingBlow ? "Yes ⚠️" : "No ✅"}
                            </span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="relative z-10 mt-4 pt-3 border-t border-gray-700 text-gray-500 text-sm">
                    No impact data available
                  </div>
                )}

                {/* Enhanced "More Details" link */}
                {event.link && (
                  <motion.a
                    whileHover={{ x: 2 }}
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 mt-4 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 group/link"
                  >
                    More Details
                    <span className="inline-block group-hover/link:translate-x-1 transition-transform">→</span>
                  </motion.a>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add this to your global CSS for the gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}