import { motion } from "framer-motion";
import { useState } from "react";
import SpaceFacts from "./SpaceFacts";
import SpaceAIAssistant from "../AI BOT/SpaceAIAssistant";

const Home = () => {
  const [activeSupernova, setActiveSupernova] = useState(null);
  const [showGameZone, setShowGameZone] = useState(false);

  // Star generation
  const generateStars = (count, config = {}) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: (Math.random() * (config.maxSize || 3) + (config.minSize || 1)) * (config.sizeMultiplier || 1),
      opacity: (Math.random() * (config.maxOpacity || 0.5) + (config.minOpacity || 0.5)) * (config.opacityMultiplier || 1),
      color: config.color || "white",
      twinkle: config.twinkle !== false
    }));
  };

  // Background stars
  const stars = generateStars(400, { maxSize: 2, minOpacity: 0.3, maxOpacity: 0.7 });

  // Constellations
  const constellations = {
    orion: {
      name: "Orion",
      stars: [
        { x: 20, y: 25, size: 3.5, opacity: 1, name: "Betelgeuse", color: "rgba(255, 100, 100, 1)" },
        { x: 20, y: 40, size: 2.8, opacity: 0.9 },
        { x: 30, y: 30, size: 3.2, opacity: 0.95 },
        { x: 30, y: 45, size: 2.5, opacity: 0.85 },
        { x: 40, y: 35, size: 3, opacity: 0.9 },
        { x: 40, y: 20, size: 3.5, opacity: 1, name: "Rigel", color: "rgba(100, 150, 255, 1)" }
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 5]]
    },
    ursaMajor: {
      name: "Ursa Major",
      stars: [
        { x: 65, y: 15, size: 3, opacity: 0.95 },
        { x: 70, y: 20, size: 2.5, opacity: 0.85 },
        { x: 75, y: 25, size: 2.8, opacity: 0.9 },
        { x: 80, y: 30, size: 3, opacity: 0.95 },
        { x: 85, y: 35, size: 2.5, opacity: 0.85 },
        { x: 90, y: 40, size: 3.2, opacity: 1 },
        { x: 95, y: 45, size: 3.5, opacity: 1, name: "Alkaid", color: "rgba(255, 255, 200, 1)" }
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]
    },
    lyra: {
      name: "Lyra",
      stars: [
        { x: 25, y: 70, size: 3.8, opacity: 1, name: "Vega", color: "rgba(150, 200, 255, 1)" },
        { x: 20, y: 75, size: 2.5, opacity: 0.8 },
        { x: 30, y: 75, size: 2.5, opacity: 0.8 },
        { x: 25, y: 80, size: 2.5, opacity: 0.8 }
      ],
      connections: [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]]
    },
    scorpius: {
      name: "Scorpius",
      stars: [
        { x: 70, y: 70, size: 3.5, opacity: 1, name: "Antares", color: "rgba(255, 150, 100, 1)" },
        { x: 75, y: 65, size: 2.5, opacity: 0.8 },
        { x: 80, y: 60, size: 2.5, opacity: 0.8 },
        { x: 85, y: 55, size: 2.5, opacity: 0.8 },
        { x: 90, y: 50, size: 2.5, opacity: 0.8 },
        { x: 85, y: 75, size: 2.5, opacity: 0.8 },
        { x: 80, y: 80, size: 2.5, opacity: 0.8 }
      ],
      connections: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6]]
    }
  };

  // Game Zone games
  const games = [
    { name: "Orbit Align", url: "/orbit-align" },
    { name: "Star Match", url: "#" },
    { name: "Cosmic Quiz", url: "#" },
    { name: "Planet Hop", url: "#" }
  ];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex text-white">
      {/* Sidebar with cosmic features */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        className="w-72 bg-gray-900 bg-opacity-50 border-r border-gray-800 p-6 flex flex-col z-20"
      >
        <h3 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Galaxia Dashboard
        </h3>
        
        {/* Space Fact of the Day */}
        <SpaceFacts/>
        
        {/* Recent Cosmic Events */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold mb-2 text-gray-400">Recent Events</h4>
          <div className="space-y-3">
            {["Meteor Shower Peak", "Jupiter Opposition", "New Moon Phase"].map((event, i) => (
              <div key={i} className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">{event}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-400">Quick Links</h4>
          <div className="space-y-2">
            <a href="https://www.nasa.gov" target="_blank" rel="noopener noreferrer" className="block text-sm p-2 hover:bg-gray-800 rounded-lg">
              NASA Website
            </a>
            <a href="https://www.spacex.com" target="_blank" rel="noopener noreferrer" className="block text-sm p-2 hover:bg-gray-800 rounded-lg">
              SpaceX Updates
            </a>
            <a href="https://www.iau.org" target="_blank" rel="noopener noreferrer" className="block text-sm p-2 hover:bg-gray-800 rounded-lg">
              Astronomical Union
            </a>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Dynamic Starfield */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <motion.div
              key={`star-${star.id}`}
              initial={{ opacity: star.opacity }}
              animate={{
                opacity: star.twinkle ? 
                  [star.opacity, star.opacity * 0.3, star.opacity] : 
                  star.opacity
              }}
              transition={{
                duration: star.twinkle ? Math.random() * 4 + 3 : 0,
                repeat: star.twinkle ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: star.color,
                boxShadow: `0 0 ${star.size * 3}px ${star.size}px ${star.color.replace('1)', '0.3)')}`,
              }}
            />
          ))}
        </div>

        {/* Galactic Core */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{ 
            scale: [0.8, 0.85, 0.8],
            opacity: [0.7, 0.8, 0.7]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-900 via-blue-900 to-black opacity-70 blur-xl"
        />

        {/* Constellation Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {Object.values(constellations).flatMap(constellation => 
            constellation.connections.map(([start, end], i) => {
              const startStar = constellation.stars[start];
              const endStar = constellation.stars[end];
              return (
                <motion.line
                  key={`${constellation.name}-line-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  x1={`${startStar.x}%`}
                  y1={`${startStar.y}%`}
                  x2={`${endStar.x}%`}
                  y2={`${endStar.y}%`}
                  stroke="rgba(173, 216, 230, 0.6)"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
              );
            })
          )}
        </svg>

        {/* Constellation Stars */}
        {Object.values(constellations).flatMap(constellation => 
          constellation.stars.map((star, i) => (
            <motion.div
              key={`${constellation.name}-star-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: star.opacity, scale: 1 }}
              transition={{ duration: 1, delay: i * 0.05 }}
              className="absolute rounded-full cursor-pointer"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 2}px`,
                height: `${star.size * 2}px`,
                background: star.color || "white",
                boxShadow: `0 0 ${star.size * 6}px ${star.size * 3}px ${(star.color || "rgba(173, 216, 230, 0.4)").replace('1)', '0.4)')}`,
              }}
              onMouseEnter={() => star.name && setActiveSupernova(star.name)}
              onMouseLeave={() => star.name && setActiveSupernova(null)}
            >
              {star.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeSupernova === star.name ? 1 : 0 }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-light whitespace-nowrap"
                >
                  {star.name}
                </motion.div>
              )}
            </motion.div>
          ))
        )}

        {/* Constellation Labels */}
        {Object.values(constellations).map(constellation => (
          <motion.div
            key={`${constellation.name}-label`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 1 }}
            className="absolute text-sm font-light italic"
            style={{
              left: `${Math.min(...constellation.stars.map(s => s.x))}%`,
              top: `${Math.min(...constellation.stars.map(s => s.y)) - 5}%`
            }}
          >
            {constellation.name}
          </motion.div>
        ))}

        {/* Game Zone Panel */}
        {showGameZone && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl z-50"
            style={{ width: "80%" }}
          >
            <h3 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Cosmic Game Zone
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {games.map((game, i) => (
                <motion.a
                  key={i}
                  href={game.url}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 flex flex-col items-center justify-center shadow-lg border border-gray-700 hover:border-purple-500 transition-all"
                >
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">{i+1}</span>
                  </div>
                  <h4 className="text-lg font-medium">{game.name}</h4>
                </motion.a>
              ))}
            </div>
            <button 
              onClick={() => setShowGameZone(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Supernova Effect */}
        {activeSupernova && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0.9, 0],
                scale: [1, 3],
              }}
              transition={{ duration: 3 }}
              className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 blur-3xl"
            />
            
            {/* Supernova Particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ 
                  x: "50%",
                  y: "50%",
                  opacity: 1,
                  scale: 0
                }}
                animate={{ 
                  x: `${50 + (Math.random() * 100 - 50)}%`,
                  y: `${50 + (Math.random() * 100 - 50)}%`,
                  opacity: [1, 0],
                  scale: [0, Math.random() * 2 + 1]
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5
                }}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  boxShadow: `0 0 ${Math.random() * 20 + 10}px ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.7)`,
                }}
              />
            ))}
            
            {/* Supernova Shockwave */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.8, 0],
                scale: [1, 4]
              }}
              transition={{ duration: 3 }}
              className="absolute border-2 border-yellow-300 rounded-full w-[500px] h-[500px]"
            />
          </>
        )}

        {/* Main Title */}
        <motion.div 
          className="text-center z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1 className="text-7xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300">
              Galaxia
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-2xl text-gray-300 mb-12 max-w-2xl"
          >
            Journey through the wonders of our universe
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex gap-6 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.a
            href="http://localhost:5173/cosmic-explorer"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 25px rgba(99, 102, 241, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-all"
          >
            Solar System
          </motion.a>

          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 25px rgba(236, 72, 153, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 text-xl font-medium bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg transition-all"
            onClick={() => setShowGameZone(true)}
          >
            Game Zone
          </motion.button>
        </motion.div>

        {/* Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            initial={{ 
              x: `${Math.random() * 100 + 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0
            }}
            animate={{ 
              x: `${Math.random() * -100 - 100}%`,
              y: `${Math.random() * 100 + 100}%`,
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 2 + 1,
              delay: Math.random() * 5,
              repeat: Infinity,
              repeatDelay: Math.random() * 10 + 5
            }}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)",
              transform: "rotate(-45deg)"
            }}
          >
            <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 w-20 h-1 bg-gradient-to-r from-transparent to-white" />
          </motion.div>
        ))}
        <SpaceAIAssistant />
      </div>
    </div>
  );
};

export default Home;