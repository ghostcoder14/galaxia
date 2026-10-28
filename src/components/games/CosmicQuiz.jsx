import { useState, useEffect } from "react";
import Confetti from "react-confetti";

const quizQuestions = [
  { 
    question: "What is the smallest planet in our solar system?", 
    options: ["Mercury", "Mars", "Venus", "Pluto"], 
    answer: "Mercury", 
    fact: "Despite being the smallest, Mercury is one of the densest planets." 
  },
  { 
    question: "Which planet is known as the 'Red Planet'?", 
    options: ["Venus", "Jupiter", "Mars", "Saturn"], 
    answer: "Mars", 
    fact: "Mars appears red due to iron oxide (rust) on its surface." 
  },
  { 
    question: "Which is the hottest planet?", 
    options: ["Mercury", "Venus", "Mars", "Jupiter"], 
    answer: "Venus", 
    fact: "Venus' thick atmosphere creates a strong greenhouse effect." 
  },
  { 
    question: "Which planet has the most moons?", 
    options: ["Earth", "Mars", "Jupiter", "Saturn"], 
    answer: "Saturn", 
    fact: "Saturn has at least 83 confirmed moons!" 
  },
  { 
    question: "What is the closest star to Earth?", 
    options: ["Sirius", "Alpha Centauri", "Betelgeuse", "Proxima Centauri"], 
    answer: "Proxima Centauri", 
    fact: "It's 4.24 light-years away from Earth." 
  },
  { 
    question: "Which planet has the Great Red Spot?", 
    options: ["Saturn", "Jupiter", "Mars", "Neptune"], 
    answer: "Jupiter", 
    fact: "This massive storm has raged for over 300 years!" 
  },
  { 
    question: "What causes the Northern Lights?", 
    options: ["Solar Wind", "Comet Dust", "Meteor Showers", "Asteroid Collisions"], 
    answer: "Solar Wind", 
    fact: "Charged particles from the Sun interact with Earth's atmosphere." 
  },
  { 
    question: "Which planet has the fastest winds?", 
    options: ["Neptune", "Saturn", "Jupiter", "Venus"], 
    answer: "Neptune", 
    fact: "Winds can reach over 1,200 mph on Neptune!" 
  },
  { 
    question: "What is the largest type of star?", 
    options: ["Red Dwarf", "Neutron Star", "Supergiant", "White Dwarf"], 
    answer: "Supergiant", 
    fact: "Supergiants can be over 1,000 times larger than our Sun." 
  },
  { 
    question: "Which planet has prominent rings?", 
    options: ["Jupiter", "Neptune", "Uranus", "Saturn"], 
    answer: "Saturn", 
    fact: "Saturn's rings are made of ice and rock particles." 
  }
];

export default function CosmicQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    if (quizCompleted) {
      setShowCelebration(true);
    }
  }, [quizCompleted]);

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }

    setTimeout(() => nextQuestion(), 1500);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizCompleted(false);
    setShowCelebration(false);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen text-white p-6 bg-cover bg-center bg-[url('/orbit-align-bg.webp')]">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60 -z-10"></div>
      
      {/* Confetti celebration */}
      {showCelebration && <Confetti />}

      {/* Quiz header */}
      <h1 className="text-3xl font-bold mb-3 text-glow">Cosmic Quiz</h1>
      <p className="text-xl text-yellow-400 mb-6">
        {!quizCompleted ? `Question ${currentQuestionIndex + 1}/10` : `Final Score: ${score}/10`}
      </p>

      {/* Quiz content */}
      {!quizCompleted ? (
        <div className="w-full max-w-2xl bg-gray-900 bg-opacity-80 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedOption !== null}
                className={`w-full p-4 text-left rounded-lg transition-all ${
                  selectedOption === null
                    ? "bg-gray-800 hover:bg-gray-700"
                    : option === currentQuestion.answer
                    ? "bg-green-600"
                    : selectedOption === option
                    ? "bg-red-600"
                    : "bg-gray-800 opacity-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Answer feedback */}
          {selectedOption && (
            <div className={`mt-6 p-4 rounded-lg ${
              selectedOption === currentQuestion.answer ? "bg-green-900" : "bg-red-900"
            }`}>
              <p className="font-bold">
                {selectedOption === currentQuestion.answer ? "Correct!" : "Incorrect!"}
              </p>
              <p className="mt-2">{currentQuestion.fact}</p>
            </div>
          )}
        </div>
      ) : (
        /* Results screen */
        <div className="w-full max-w-2xl bg-gray-900 bg-opacity-80 rounded-xl p-8 shadow-2xl text-center">
          <h2 className="text-3xl font-bold text-green-500 mb-4">Quiz Complete!</h2>
          <div className="text-5xl mb-6">{score >= 7 ? "🎉" : score >= 4 ? "✨" : "🌌"}</div>
          <p className="text-xl mb-2">Your score: <span className="text-yellow-400">{score}/10</span></p>
          <p className="text-lg mb-6">
            {score === 10 ? "Perfect! You're a space expert!" :
             score >= 7 ? "Great job! You know your cosmos!" :
             score >= 4 ? "Not bad! Keep exploring!" :
             "The universe has more secrets to discover!"}
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </div>
  );
}