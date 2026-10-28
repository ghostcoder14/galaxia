import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SpaceFacts from "./SpaceFacts";
import RecentEvents from "./RecentEvents";
import { games } from "./games";
import { getConstellations } from "./constellations";
import SpaceAIAssistant from "../AI BOT/SpaceAIAssistant";

const Home = () => {
  const [activeSupernova, setActiveSupernova] = useState(null);
  const [showGameZone, setShowGameZone] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const constellations = getConstellations(isMobile);

  // Simplified star generation for mobile
  const generateStars = (count, config = {}) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isMobile
        ? (Math.random() * 2 + 0.5) * (config.sizeMultiplier || 1)
        : (Math.random() * (config.maxSize || 3) + (config.minSize || 1)) *
          (config.sizeMultiplier || 1),
      opacity: isMobile
        ? (Math.random() * 0.3 + 0.3) * (config.opacityMultiplier || 1)
        : (Math.random() * (config.maxOpacity || 0.5) +
            (config.minOpacity || 0.5)) *
          (config.opacityMultiplier || 1),
      color: config.color || "white",
      twinkle: isMobile ? false : config.twinkle !== false, // Disable twinkle on mobile
    }));
  };

  // Reduced number of stars on mobile
  const stars = generateStars(isMobile ? 150 : 400, {
    maxSize: 2,
    minOpacity: 0.3,
    maxOpacity: 0.7,
  });

  // Disable supernova effect on mobile
  const handleStarInteraction = (star) => {
    if (isMobile) return;
    if (star.name) {
      setActiveSupernova(star.name);
      setHoveredStar(star.id);
    }
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex text-white">
      {/* Sidebar - Hidden on mobile */}
      <motion.div
        initial={{ x: isMobile ? -300 : 0 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
        className={`${
          isMobile ? "hidden" : "w-72"
        } bg-gray-900 bg-opacity-50 border-r border-gray-800 p-6 flex flex-col z-20`}
      >
        <motion.div
          className="relative w-full h-40 mb-8 rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-black/50 backdrop-blur-sm"></div>

          {/* Solar System Model */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <motion.div
              className="relative w-24 h-24"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Sun */}
              <motion.div
                className="absolute w-8 h-8 bg-yellow-300 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 20px 5px rgba(255, 200, 50, 0.5)",
                    "0 0 30px 10px rgba(255, 200, 50, 0.7)",
                    "0 0 20px 5px rgba(255, 200, 50, 0.5)",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
              />

              {/* Planets */}
              {[
                { size: 2, color: "bg-gray-400", distance: 12, duration: 5 },
                { size: 3, color: "bg-yellow-200", distance: 18, duration: 8 },
                { size: 2.5, color: "bg-blue-400", distance: 24, duration: 12 },
                { size: 2, color: "bg-red-400", distance: 30, duration: 20 },
              ].map((planet, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${planet.color} rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                  style={{
                    width: `${planet.size * 4}px`,
                    height: `${planet.size * 4}px`,
                  }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 4) * planet.distance,
                    y: Math.sin((i * Math.PI * 2) / 4) * planet.distance,
                  }}
                  transition={{
                    duration: planet.duration,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Moons for some planets */}
                  {i > 0 && i < 3 && (
                    <motion.div
                      className="absolute bg-gray-200 rounded-full"
                      style={{
                        width: `${planet.size}px`,
                        height: `${planet.size}px`,
                        top: `${planet.size * 1.5}px`,
                        left: `${planet.size * 1.5}px`,
                      }}
                      animate={{
                        x: Math.cos(i * 2) * planet.size * 2,
                        y: Math.sin(i * 2) * planet.size * 2,
                      }}
                      transition={{
                        duration: planet.duration / 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </motion.div>
              ))}

              {/* Asteroid Belt */}
              <motion.div
                className="absolute border border-gray-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "48px",
                  height: "48px",
                }}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Title with better positioning */}
          <motion.div
            className="absolute bottom-4 left-0 right-0 text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
        <SpaceFacts />
        <RecentEvents />
        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold mb-2 text-gray-400">
            Quick Links
          </h4>
          <div className="space-y-2">
            <a
              href="https://www.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm p-2 hover:bg-gray-800 rounded-lg"
            >
              NASA Website
            </a>
            <a
              href="https://www.spacex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm p-2 hover:bg-gray-800 rounded-lg"
            >
              SpaceX Updates
            </a>
            <a
              href="https://www.iau.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm p-2 hover:bg-gray-800 rounded-lg"
            >
              Astronomical Union
            </a>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Dynamic Starfield - simplified for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map((star) => (
            <motion.div
              key={`star-${star.id}`}
              initial={{ opacity: star.opacity }}
              animate={{
                opacity: star.twinkle
                  ? [star.opacity, star.opacity * 0.3, star.opacity]
                  : star.opacity,
                scale: hoveredStar === star.id ? [1, 1.2, 1] : 1,
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
                boxShadow: isMobile
                  ? "none"
                  : `0 0 ${star.size * 3}px ${star.size}px ${star.color.replace(
                      "1)",
                      "0.3)"
                    )}`,
              }}
            />
          ))}
        </div>

        {/* Simplified Galactic Core for mobile */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{
            scale: [0.8, 0.85, 0.8],
            opacity: [0.7, 0.8, 0.7],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${
            isMobile ? "w-[300px] h-[300px]" : "w-[600px] h-[600px]"
          } rounded-full bg-gradient-to-br from-purple-900 via-blue-900 to-black opacity-70 blur-xl`}
        />

        {/* Constellation Connections - simplified for mobile */}
        {!isMobile && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {Object.values(constellations).flatMap((constellation) =>
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
        )}

        {/* Constellation Stars - simplified for mobile */}
        {Object.values(constellations).flatMap((constellation) =>
          constellation.stars.map((star, i) => (
            <motion.div
              key={`${constellation.name}-star-${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: star.opacity,
                scale: 1,
                boxShadow:
                  !isMobile && activeSupernova === star.name
                    ? [
                        `0 0 ${star.size * 6}px ${star.size * 3}px ${(
                          star.color || "rgba(173, 216, 230, 0.4)"
                        ).replace("1)", "0.4)")}`,
                        `0 0 ${star.size * 15}px ${star.size * 8}px ${(
                          star.color || "rgba(255, 255, 200, 0.8)"
                        ).replace("1)", "0.8)")}`,
                        `0 0 ${star.size * 6}px ${star.size * 3}px ${(
                          star.color || "rgba(173, 216, 230, 0.4)"
                        ).replace("1)", "0.4)")}`,
                      ]
                    : `0 0 ${star.size * (isMobile ? 3 : 6)}px ${
                        star.size * (isMobile ? 1.5 : 3)
                      }px ${(star.color || "rgba(173, 216, 230, 0.4)").replace(
                        "1)",
                        "0.4)"
                      )}`,
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                boxShadow: {
                  duration: !isMobile && activeSupernova === star.name ? 3 : 0,
                  repeat:
                    !isMobile && activeSupernova === star.name ? Infinity : 0,
                },
              }}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * (isMobile ? 1.5 : 2)}px`,
                height: `${star.size * (isMobile ? 1.5 : 2)}px`,
                background: star.color || "white",
                zIndex: !isMobile && activeSupernova === star.name ? 10 : 1,
              }}
              onMouseEnter={() => handleStarInteraction(star)}
              onMouseLeave={() => {
                if (!isMobile && star.name) {
                  setActiveSupernova(null);
                  setHoveredStar(null);
                }
              }}
            >
              {!isMobile && star.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: activeSupernova === star.name ? 1 : 0,
                    y: activeSupernova === star.name ? [-5, 0, -5] : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: activeSupernova === star.name ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-light whitespace-nowrap"
                >
                  {star.name}
                </motion.div>
              )}
            </motion.div>
          ))
        )}

        {/* Game Zone Panel - modified for mobile */}
        <AnimatePresence>
          {showGameZone && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl z-50"
              style={{ width: isMobile ? "90%" : "80%" }}
            >
              <h3 className="text-xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Galaxia Game Zone
              </h3>
              <div
                className={`grid ${
                  isMobile ? "grid-cols-1 gap-3" : "grid-cols-2 gap-6"
                }`}
              >
                {games.map((game, i) => (
                  <motion.a
                    key={i}
                    href={game.url}
                    whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${game.bg} rounded-lg p-3 flex flex-col items-center justify-center shadow-lg border border-gray-700 hover:border-purple-500 transition-all`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                      {game.icon}
                    </div>
                    <h4 className="text-md font-medium text-center">
                      {game.name}
                    </h4>
                  </motion.a>
                ))}
              </div>
              <button
                onClick={() => setShowGameZone(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Supernova Effect - disabled on mobile */}
        {!isMobile && activeSupernova && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0.5, 1.5, 3],
              }}
              transition={{
                duration: 3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 blur-3xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.5, 1, 2],
              }}
              transition={{
                duration: 3,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-yellow-200 to-orange-500 blur-xl"
            />

            {/* Supernova Particles */}
            {[...Array(60)].map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 100 + 50;
              const size = Math.random() * 15 + 5;
              const duration = 2 + Math.random() * 3;
              const delay = Math.random() * 0.5;
              const color = `rgba(255, ${Math.floor(
                150 + Math.random() * 100
              )}, ${Math.floor(50 + Math.random() * 100)}, 1)`;

              return (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                  animate={{
                    x: `calc(50% + ${Math.cos(angle) * distance}px)`,
                    y: `calc(50% + ${Math.sin(angle) * distance}px)`,
                    opacity: [0, 1, 0],
                    scale: [0, Math.random() * 1.5 + 0.5, 0],
                  }}
                  transition={{ duration, delay, ease: "easeOut" }}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    background: color,
                    boxShadow: `0 0 ${size * 2}px ${size / 2}px ${color.replace(
                      "1)",
                      "0.7)"
                    )}`,
                    filter: `blur(${Math.random() > 0.7 ? "1px" : "0px"})`,
                    zIndex: 5,
                  }}
                />
              );
            })}

            {/* Shockwave Rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`shockwave-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.6, 0], scale: [1, 4 + i * 2] }}
                transition={{ duration: 3, delay: i * 0.3, ease: "easeOut" }}
                className="absolute border border-yellow-300 rounded-full w-[500px] h-[500px] pointer-events-none"
                style={{ zIndex: 4 - i }}
              />
            ))}

            {/* Ambient Glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0] }}
              transition={{ duration: 3 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-orange-500/10 pointer-events-none"
            />

            {/* Background Star Reaction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3 }}
              className="absolute inset-0 pointer-events-none"
            >
              {stars.slice(0, 100).map((star) => (
                <motion.div
                  key={`react-star-${star.id}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size * 2}px`,
                    height: `${star.size * 2}px`,
                    background: star.color,
                    boxShadow: `0 0 ${star.size * 6}px ${
                      star.size * 3
                    }px ${star.color.replace("1)", "0.4)")}`,
                  }}
                  animate={{
                    opacity: [star.opacity, star.opacity * 2, star.opacity],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3,
                    delay: Math.random() * 1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </>
        )}

        {/* Main Title - adjusted for mobile */}
        <motion.div
          className="text-center z-10 px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <h1
            className={`${isMobile ? "text-5xl" : "text-7xl"} font-bold mb-4`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300">
              Galaxia
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={`${
              isMobile ? "text-lg" : "text-2xl"
            } text-gray-300 mb-8 ${isMobile ? "px-4" : "max-w-2xl"}`}
          >
            Journey through the wonders of our universe
          </motion.p>
        </motion.div>

        {/* CTA Buttons - adjusted for mobile */}
        <motion.div
          className={`flex ${
            isMobile ? "flex-col gap-4" : "gap-6"
          } z-10 px-4 w-full justify-center ${isMobile ? "max-w-xs" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.a
            href="/solar-system"
            whileHover={{
              scale: isMobile ? 1 : 1.05,
              boxShadow: isMobile ? "none" : "0 0 25px rgba(99, 102, 241, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`${isMobile ? "w-full" : "px-10"} py-4 ${
              isMobile ? "text-lg" : "text-xl"
            } font-medium bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg transition-all text-center`}
          >
            Solar System
          </motion.a>

          <motion.button
            whileHover={{
              scale: isMobile ? 1 : 1.05,
              boxShadow: isMobile ? "none" : "0 0 25px rgba(236, 72, 153, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`${isMobile ? "w-full" : "px-10"} py-4 ${
              isMobile ? "text-lg" : "text-xl"
            } font-medium bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg transition-all`}
            onClick={() => setShowGameZone(true)}
          >
            Game Zone
          </motion.button>
        </motion.div>

        {/* Shooting Stars - disabled on mobile */}
        {!isMobile &&
          [...Array(3)].map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              initial={{
                x: `${Math.random() * 100 + 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * -100 - 100}%`,
                y: `${Math.random() * 100 + 100}%`,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 5,
                repeat: Infinity,
                repeatDelay: Math.random() * 10 + 5,
              }}
              className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)",
                transform: "rotate(-45deg)",
                zIndex: 10,
              }}
            >
              <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 w-20 h-1 bg-gradient-to-r from-transparent to-white" />
            </motion.div>
          ))}
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
