import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import PlanetSelector from "./PlanetSelector";
import { planets } from "./planets";
import { StarsBackground } from "../ui/stars-background";
import { ShootingStars } from "../ui/shooting-stars";
import { GenAI } from "../../lib/genai";
import SizeComparison from "./SizeComparison";

// Planet Component with Rotation Animation
const Planet = ({ image, position, onClick, selected }) => {
  const planetTexture = useTexture(image);
  const planetRef = useRef();

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Sphere
      ref={planetRef}
      args={[2, 75, 75]}
      position={position}
      onClick={onClick}
      scale={selected ? 1.5 : 1}
    >
      <meshStandardMaterial map={planetTexture} />
    </Sphere>
  );
};

const PlanetExplorer = () => {
  const [selectedPlanet, setSelectedPlanet] = useState(planets[0]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added missing state

  useEffect(() => {
    const fetchDescription = async () => {
      setLoading(true);
      try {
        const text = await GenAI(`Write 50 words about ${selectedPlanet.name}`);
        setDescription(text);
      } catch (error) {
        console.error("Error fetching planet description:", error);
        setDescription("Description unavailable.");
      } finally {
        setLoading(false);
      }
    };

    fetchDescription();
  }, [selectedPlanet]);

  return (
    <div className="flex flex-col p-2 w-full bg-black">
      <StarsBackground />
      <ShootingStars />
      <div className="flex space-x-2 mb-4 z-20">
        <PlanetSelector
          onSelect={(planet) => {
            const selected = planets.find((p) => p.name === planet.name);
            if (selected) setSelectedPlanet(selected);
          }}
        />
      </div>

      <div className="flex w-full justify-evenly z-20">
        <Canvas style={{ height: "60vh", width: "50%" }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} enablePan={true} />

          <Planet
            key={selectedPlanet.name}
            image={selectedPlanet.image}
            position={[0, 0, 0]}
            onClick={() => setSelectedPlanet(selectedPlanet)}
            selected={true}
          />
        </Canvas>

        {/* Info Panel with Advanced Animation */}
        <div className="w-1/2 h-full flex items-center justify-center px-8">
          <motion.div
            className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-52 overflow-y-auto">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6"></div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">{description}</p>
              )}
            </div>

            <div className="mt-4 text-sm text-blue-400">
              Distance: {selectedPlanet.distance}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-20 flex justify-center">
        <SizeComparison />
      </div>
    </div>
  );
};

export default PlanetExplorer;
