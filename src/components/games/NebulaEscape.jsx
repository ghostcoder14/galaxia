import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NebulaEscape = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  // Game variables
  const ship = useRef({
    x: 80,
    y: 250,
    width: 50,
    height: 60,
    lane: 1 // 0: top, 1: middle, 2: bottom
  });
  
  const obstacles = useRef([]);
  const collectibles = useRef([]);
  const animationRef = useRef();
  const lanes = [150, 250, 350];
  const speed = useRef(3); // Reduced base speed

  // Space-themed assets
  const shipColors = ['#4fd1c5', '#4299e1', '#9f7aea'];
  const obstacleTypes = [
    { color: '#f56565', width: 40, height: 60 }, // Asteroid
    { color: '#ecc94b', width: 60, height: 30 }, // Space debris
    { color: '#f687b3', width: 50, height: 50 }  // Comet
  ];
  const collectibleTypes = [
    { color: '#68d391', score: 50 },  // Green energy
    { color: '#f6e05e', score: 100 }, // Yellow star
    { color: '#b794f4', score: 150 }  // Purple crystal
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawShip = () => {
      ctx.fillStyle = shipColors[Math.floor(score/1000) % shipColors.length];
      ctx.beginPath();
      // More detailed spaceship shape
      ctx.moveTo(ship.current.x, ship.current.y);
      ctx.lineTo(ship.current.x - 25, ship.current.y + 30);
      ctx.lineTo(ship.current.x - 15, ship.current.y + 60);
      ctx.lineTo(ship.current.x + 15, ship.current.y + 60);
      ctx.lineTo(ship.current.x + 25, ship.current.y + 30);
      ctx.closePath();
      ctx.fill();
      
      // Ship engine glow
      ctx.fillStyle = '#f6ad55';
      ctx.beginPath();
      ctx.moveTo(ship.current.x - 15, ship.current.y + 60);
      ctx.lineTo(ship.current.x, ship.current.y + 80);
      ctx.lineTo(ship.current.x + 15, ship.current.y + 60);
      ctx.closePath();
      ctx.fill();
    };

    const drawObstacles = () => {
      obstacles.current.forEach(obs => {
        ctx.fillStyle = obs.color;
        
        if (obs.type === 0) { // Asteroid
          ctx.beginPath();
          ctx.arc(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 1) { // Debris (rectangular)
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        } else { // Comet (triangle)
          ctx.beginPath();
          ctx.moveTo(obs.x, obs.y);
          ctx.lineTo(obs.x + obs.width, obs.y + obs.height/2);
          ctx.lineTo(obs.x, obs.y + obs.height);
          ctx.closePath();
          ctx.fill();
        }
      });
    };

    const drawCollectibles = () => {
      collectibles.current.forEach(col => {
        ctx.fillStyle = col.color;
        
        if (col.type === 0) { // Energy orb
          ctx.beginPath();
          ctx.arc(col.x + 15, col.y + 15, 15, 0, Math.PI * 2);
          ctx.fill();
        } else if (col.type === 1) { // Star
          drawStar(ctx, col.x + 15, col.y + 15, 5, 15, 7);
        } else { // Crystal
          drawCrystal(ctx, col.x, col.y, 30, 30);
        }
      });
    };

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
      let rot = Math.PI/2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const drawCrystal = (ctx, x, y, width, height) => {
      ctx.beginPath();
      ctx.moveTo(x + width/2, y);
      ctx.lineTo(x + width, y + height/3);
      ctx.lineTo(x + width/2, y + height);
      ctx.lineTo(x, y + height/3);
      ctx.closePath();
      ctx.fill();
    };

    const drawNebula = () => {
      // Background nebula effect
      const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width
      );
      gradient.addColorStop(0, '#2d374850');
      gradient.addColorStop(0.7, '#4c51bf50');
      gradient.addColorStop(1, '#9f7aea50');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = (Math.random() * canvas.height + (Date.now()/100 * speed.current/3)) % canvas.height;
        const size = Math.random() * 3;
        const opacity = Math.random();
        ctx.globalAlpha = opacity;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const updateGame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw space background
      drawNebula();
      drawStars();
      
      // Draw game elements
      drawObstacles();
      drawCollectibles();
      drawShip();

      // Move obstacles and collectibles
      obstacles.current = obstacles.current.map(obs => ({
        ...obs,
        x: obs.x - speed.current
      })).filter(obs => obs.x > -100);

      collectibles.current = collectibles.current.map(col => ({
        ...col,
        x: col.x - speed.current
      })).filter(col => col.x > -50);

      // Generate new obstacles (less frequent)
      if (Math.random() < 0.015) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.floor(Math.random() * obstacleTypes.length);
        obstacles.current.push({
          x: canvas.width,
          y: lanes[lane],
          ...obstacleTypes[type],
          type
        });
      }

      // Generate collectibles (rare)
      if (Math.random() < 0.008) {
        const lane = Math.floor(Math.random() * 3);
        const type = Math.floor(Math.random() * collectibleTypes.length);
        collectibles.current.push({
          x: canvas.width,
          y: lanes[lane] + 10,
          width: 30,
          height: 30,
          ...collectibleTypes[type],
          type
        });
      }

      // Collision detection with obstacles
      const collision = obstacles.current.some(obs => {
        return (
          ship.current.x < obs.x + obs.width &&
          ship.current.x + 25 > obs.x &&
          ship.current.y < obs.y + obs.height &&
          ship.current.y + 60 > obs.y
        );
      });

      // Collection detection
      collectibles.current.forEach((col, index) => {
        if (
          ship.current.x < col.x + col.width &&
          ship.current.x + 25 > col.x &&
          ship.current.y < col.y + col.height &&
          ship.current.y + 60 > col.y
        ) {
          setScore(prev => prev + col.score);
          collectibles.current.splice(index, 1);
        }
      });

      if (collision) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
        cancelAnimationFrame(animationRef.current);
        return;
      }

      // Increase score and difficulty
      setScore(prev => prev + 1);
      if (score % 1000 === 0) {
        speed.current += 0.3; // Slower difficulty progression
      }

      animationRef.current = requestAnimationFrame(updateGame);
    };

    if (isPlaying && !gameOver) {
      animationRef.current = requestAnimationFrame(updateGame);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameOver, score]);

  const handleKeyDown = (e) => {
    if (!isPlaying && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      setIsPlaying(true);
      setGameOver(false);
      setScore(0);
      obstacles.current = [];
      collectibles.current = [];
      ship.current.lane = 1;
      ship.current.y = lanes[1];
      speed.current = 3;
      return;
    }

    if (e.key === 'ArrowUp' && ship.current.lane > 0) {
      ship.current.lane -= 1;
      ship.current.y = lanes[ship.current.lane];
    } else if (e.key === 'ArrowDown' && ship.current.lane < 2) {
      ship.current.lane += 1;
      ship.current.y = lanes[ship.current.lane];
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
        Nebula Escape
      </h1>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="border-4 border-purple-500 rounded-xl shadow-lg shadow-purple-500/20"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 rounded-xl">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">
              {gameOver ? 'Mission Failed' : 'Nebula Escape'}
            </h2>
            {gameOver && (
              <>
                <p className="text-xl text-white mb-2">Score: {score}</p>
                <p className="text-lg text-yellow-300 mb-6">High Score: {highScore}</p>
              </>
            )}
            <button
              onClick={() => {
                setIsPlaying(true);
                setGameOver(false);
                setScore(0);
                obstacles.current = [];
                collectibles.current = [];
                speed.current = 3;
              }}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
            >
              {gameOver ? 'Retry Mission' : 'Launch Spaceship'}
            </button>
            <p className="text-gray-400 mt-6 text-sm">
              Use ↑ ↓ arrows to navigate | Collect items for bonus points
            </p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 rounded-xl">
            <h2 className="text-3xl font-bold text-red-400 mb-2">Ship Destroyed!</h2>
            <p className="text-2xl text-white mb-1">Final Score: {score}</p>
            <p className="text-xl text-yellow-300 mb-6">High Score: {highScore}</p>
            <button
              onClick={() => {
                setIsPlaying(true);
                setGameOver(false);
                setScore(0);
                obstacles.current = [];
                collectibles.current = [];
                speed.current = 3;
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg mb-4"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Return to Hangar
            </button>
          </div>
        )}
      </div>
      <div className="mt-6 flex gap-8 text-white">
        <div className="text-center">
          <p className="text-2xl font-mono">{score}</p>
          <p className="text-sm text-gray-400">SCORE</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-mono">{highScore}</p>
          <p className="text-sm text-gray-400">HIGH SCORE</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-mono">{Math.floor(speed.current * 5)}</p>
          <p className="text-sm text-gray-400">SPEED</p>
        </div>
      </div>
    </div>
  );
};

export default NebulaEscape;