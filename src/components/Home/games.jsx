import { motion } from "framer-motion";

export const games = [
  {
    name: "Orbit Align",
    url: "/orbit-align",
    icon: (
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute w-4 h-4 bg-blue-400 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-2 h-2 bg-yellow-300 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute w-12 h-1 bg-transparent border border-blue-300 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </motion.div>
    ),
    bg: "bg-gradient-to-br from-blue-800 to-indigo-900",
  },
  {
    name: "Star Match",
    url: "/star-match",
    icon: (
      <motion.div className="relative w-full h-full">
        <div className="absolute w-6 h-6 bg-yellow-300 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-8 bg-yellow-200 rounded-full top-1/2 left-1/2 origin-bottom"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 72}deg)`,
              height: `${Math.random() * 10 + 6}px`,
            }}
            animate={{
              height: [
                `${Math.random() * 10 + 6}px`,
                `${Math.random() * 10 + 12}px`,
                `${Math.random() * 10 + 6}px`,
              ],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>
    ),
    bg: "bg-gradient-to-br from-purple-800 to-pink-900",
  },
  {
    name: "Galactic Quiz",
    url: "/cosmic-quiz",
    icon: (
      <motion.div className="relative w-full h-full flex items-center justify-center">
        <div className="text-3xl">?</div>
        <motion.div
          className="absolute w-16 h-16 border-2 border-yellow-400 rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </motion.div>
    ),
    bg: "bg-gradient-to-br from-indigo-800 to-blue-900",
  },
  {
    name: "Nebula Escape",
    url: "nebula-escape",
    icon: (
      <motion.div className="relative w-full h-full">
        {/* Nebula core */}
        <motion.div
          className="absolute w-8 h-8 rounded-full bg-purple-500 blur-[6px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />

        {/* Swirling nebula arms */}
        {[0, 120, 240].map((angle) => (
          <motion.div
            key={angle}
            className="absolute w-12 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-300 top-1/2 left-1/2 origin-left"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
            animate={{
              scaleX: [1, 1.5, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Infinity,
              delay: angle / 120,
            }}
          />
        ))}

        {/* Distant stars */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 60 + 20}%`,
              top: `${Math.random() * 60 + 20}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>
    ),
    bg: "bg-gradient-to-br from-purple-900/90 via-indigo-900/80 to-gray-900",
  },
];
