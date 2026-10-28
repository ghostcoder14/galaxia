import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useSound from "use-sound";
import successSound from "/sounds/success.mp3";

const planetsData = [
  { name: "Mercury", id: 1, image: "/textures/mercury.jpg" },
  { name: "Venus", id: 2, image: "/textures/venus.jpg" },
  { name: "Earth", id: 3, image: "/textures/earth.jpg" },
  { name: "Mars", id: 4, image: "/textures/mars.jpg" },
  { name: "Jupiter", id: 5, image: "/textures/jupiter.jpg" },
  { name: "Saturn", id: 6, image: "/textures/saturn.jpg" },
  { name: "Uranus", id: 7, image: "/textures/uranus.jpg" },
  { name: "Neptune", id: 8, image: "/textures/neptune.jpg" },
];

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ArrangePlanets() {
  const [correctlyPlaced, setCorrectlyPlaced] = useState([]);
  const [shuffledPlanets, setShuffledPlanets] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [playSuccess] = useSound(successSound, { volume: 0.6 });

  // Hint System
  const [hintsLeft, setHintsLeft] = useState(2);
  const [hintHighlight, setHintHighlight] = useState(null);
  const [hintPlanet, setHintPlanet] = useState(null);

  // Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setShuffledPlanets(shuffleArray(planetsData));
  }, []);

  // Check if all planets are placed
  useEffect(() => {
    if (correctlyPlaced.length === planetsData.length) {
      setTimeout(() => {
        setShowCelebration(true);
        playSuccess();
        setShowSuccessModal(true); // Show "Play Again" modal
      }, 500);
    }
  }, [correctlyPlaced, playSuccess]);

  // Drag Drop Handler
  const handleDrop = (event, index) => {
    event.preventDefault();
    const planetId = event.dataTransfer.getData("planetId");
    if (parseInt(planetId) === index + 1) {
      // Mark the planet as correctly placed
      if (!correctlyPlaced.includes(index)) {
        setCorrectlyPlaced((prev) => [...prev, index]);
      }
    }
  };

  // Hint System
  const useHint = () => {
    if (hintsLeft > 0) {
      const misplacedPlanets = planetsData.filter(
        (_, index) => !correctlyPlaced.includes(index)
      );
      if (misplacedPlanets.length > 0) {
        const randomPlanet =
          misplacedPlanets[Math.floor(Math.random() * misplacedPlanets.length)];
        setHintHighlight(randomPlanet.id - 1);
        setHintPlanet(randomPlanet.name);
        setTimeout(() => {
          setHintHighlight(null);
          setHintPlanet(null);
        }, 2000);
        setHintsLeft((prev) => prev - 1);
      }
    }
  };

  // Reset Game
  const resetGame = () => {
    setCorrectlyPlaced([]);
    setShuffledPlanets(shuffleArray(planetsData));
    setShowCelebration(false);
    setShowSuccessModal(false);
    setHintsLeft(2);
    setHintHighlight(null);
    setHintPlanet(null);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen text-white p-6 bg-cover bg-center bg-[url('/orbit-align-bg.webp')]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 -z-10"></div>

      {showCelebration && <Confetti />}

      {/* Title & Subtitle */}
      <h1 className="text-3xl font-bold mb-3 text-glow z-10">Orbit Align</h1>
      <span className="text-xl text-red-500 mb-10 z-10">
        Arrange the planets in the correct order
      </span>

      {/* Hints Button */}
      <button
        onClick={useHint}
        disabled={hintsLeft === 0}
        className="mb-6 px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg shadow-md hover:bg-yellow-400 disabled:bg-gray-500 z-10"
      >
        Use Hint ({hintsLeft} Left)
      </button>

      {/* Draggable Planets */}
      <div className="flex gap-6 p-4 z-10">
        {shuffledPlanets.map((planet) => (
          <div key={planet.id} className="relative flex flex-col items-center gap-2">
            {/* Checkmark on Planet if placed */}
            {correctlyPlaced.includes(planet.id - 1) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 left-0 text-green-400 text-2xl"
              >
                ✅
              </motion.span>
            )}
            {/* Planet Image */}
            <motion.div
              className={`w-20 h-20 cursor-pointer rounded-full shadow-lg glow ${
                correctlyPlaced.includes(planet.id - 1) ? "opacity-50" : ""
              }`}
              draggable={!correctlyPlaced.includes(planet.id - 1)}
              onDragStart={(e) => e.dataTransfer.setData("planetId", planet.id)}
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src={planet.image}
                alt={planet.name}
                className="w-20 h-20 rounded-full border-2 border-white shadow-2xl"
              />
            </motion.div>
            <span className="text-red-600">{planet.name}</span>
          </div>
        ))}
      </div>

      {/* Orbit Drop Zones */}
      <div className="flex gap-5 items-center m-10 z-10">
        {/* Sun (Optional) */}
        <div className="w-28 h-28 rounded-full bg-amber-500 shadow-lg"></div>

        {planetsData.map((planet, index) => (
          <div
            key={index}
            className={`w-28 h-28 border-4 rounded-full flex items-center justify-center mb-6 relative glow ${
              correctlyPlaced.includes(index)
                ? "border-green-500"
                : "border-blue-500"
            } ${
              hintHighlight === index ? "border-yellow-500 animate-pulse" : ""
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Show Planet Name Above if Hint is Highlighting This Slot */}
            {hintHighlight === index && (
              <span className="absolute top-[-30px] text-yellow-400 font-bold text-lg">
                {hintPlanet}
              </span>
            )}

            {/* If correct => show planet with checkmark, else show '?' */}
            {correctlyPlaced.includes(index) ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <img
                  src={planet.image}
                  alt={planet.name}
                  className="w-24 h-24 rounded-full"
                />
              </motion.div>
            ) : (
              <span className="text-red-500 text-4xl">?</span>
            )}
          </div>
        ))}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-70 z-50"
        >
          <div className="bg-white p-6 rounded-lg text-center shadow-xl">
            <h2 className="text-3xl font-bold text-green-600">Congratulations! 🎉</h2>
            <p className="text-lg text-gray-800 mt-2">
              You have successfully arranged the planets in their correct order!
            </p>
            <button
              onClick={() => {
                // Reset the game
                setCorrectlyPlaced([]);
                setShuffledPlanets(shuffleArray(planetsData));
                setShowCelebration(false);
                setShowSuccessModal(false);
                setHintsLeft(2);
                setHintHighlight(null);
                setHintPlanet(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition"
            >
              Play Again
            </button>
          </div>
        </motion.div>
      )}

      <style>
        {`
          .glow {
            box-shadow: 0px 0px 14px rgba(255, 255, 255, 0.8);
          }
          .text-glow {
            text-shadow: 0 0 9px rgba(255, 255, 255, 0.9);
          }
        `}
      </style>
    </div>
  );
}