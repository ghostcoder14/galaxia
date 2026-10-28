import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import useSound from "use-sound";
import successSound from "/sounds/success.mp3";

const starTypes = [
  { id: 1, name: "Red Giant", icon: "🌟", color: "text-red-500" },
  { id: 2, name: "Blue Supergiant", icon: "💫", color: "text-blue-400" },
  { id: 3, name: "White Dwarf", icon: "⭐", color: "text-gray-300" },
  { id: 4, name: "Neutron Star", icon: "✨", color: "text-purple-400" },
  { id: 5, name: "Binary Star", icon: "🌠", color: "text-yellow-300" },
  { id: 6, name: "Protostar", icon: "☄️", color: "text-orange-400" },
];

function createPairs() {
  const pairs = [...starTypes, ...starTypes]
    .map((star, index) => ({ ...star, uniqueId: index }))
    .sort(() => Math.random() - 0.5);
  return pairs;
}

export default function StarMatch() {
  const [cards, setCards] = useState(createPairs());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [playSuccess] = useSound(successSound, { volume: 0.6 });

  useEffect(() => {
    if (matched.length === starTypes.length) {
      setShowCelebration(true);
      playSuccess();
    }
  }, [matched, playSuccess]);

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(cards.find(card => card.uniqueId === id)?.id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    setMoves(moves + 1);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.uniqueId === firstId);
      const secondCard = cards.find(card => card.uniqueId === secondId);

      if (firstCard.id === secondCard.id) {
        setMatched((prev) => [...prev, firstCard.id]);
        setTimeout(() => setFlipped([]), 300);  
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    setCards(createPairs());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setShowCelebration(false);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen text-white p-6 bg-cover bg-center bg-[url('/orbit-align-bg.webp')]">
      <div className="absolute inset-0 bg-black opacity-60 -z-10"></div>
      
      {showCelebration && <Confetti />}

      <h1 className="text-3xl font-bold mb-3 text-glow z-10">Star Match</h1>
      <span className="text-xl text-red-500 mb-6 z-10">
        {matched.length === starTypes.length 
          ? "You matched all stars!" 
          : `Moves: ${moves} | Matched: ${matched.length}/${starTypes.length}`}
      </span>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 z-10">
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.uniqueId) || matched.includes(card.id);
          return (
            <motion.div
              key={card.uniqueId}
              className={`w-20 h-20 flex items-center justify-center rounded-lg cursor-pointer text-4xl ${
                isFlipped ? card.color : "bg-gray-800"
              }`}
              onClick={() => handleCardClick(card.uniqueId)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isFlipped ? 0 : 180 }}
              transition={{ duration: 0.6 }}
            >
              {isFlipped ? card.icon : "🌌"}
            </motion.div>
          );
        })}
      </div>

      {matched.length === starTypes.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 bg-gray-900 bg-opacity-80 p-6 rounded-xl shadow-2xl text-center z-10"
        >
          <h2 className="text-2xl font-bold text-green-500 mb-4">Congratulations!</h2>
          <p className="mb-4">You matched all stars in {moves} moves!</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
          >
            Play Again
          </button>
        </motion.div>
      )}

      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}