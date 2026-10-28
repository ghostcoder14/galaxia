import React, { useState } from "react";
import { motion } from "framer-motion";
import { planets } from "./planets";

const SizeComparison = () => {
  const [object1, setObject1] = useState(planets[0]);
  const [object2, setObject2] = useState(planets[1]);

  // Calculate ratio with error handling
  const ratio =
    object1.diameter && object2.diameter
      ? (object1.diameter / object2.diameter).toFixed(2)
      : "N/A";

  // Normalize sizes for visualization (scaled to fit container)
  const maxDiameter = Math.max(object1.diameter || 0, object2.diameter || 0);
  const object1Width = object1.diameter ? (object1.diameter / maxDiameter) * 100 : 50;
  const object2Width = object2.diameter ? (object2.diameter / maxDiameter) * 100 : 50;

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-lg w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Astronomical Object Size Comparison
      </h2>

      {/* Selection Dropdowns */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-300">First Object</label>
          <select
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
            value={object1.name}
            onChange={(e) => setObject1(planets.find((p) => p.name === e.target.value))}
          >
            {planets.map((p) => (
              <option key={`1-${p.name}`} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-center my-2 md:my-0">
          <div className="text-2xl text-gray-400">vs</div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1 text-gray-300">Second Object</label>
          <select
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
            value={object2.name}
            onChange={(e) => setObject2(planets.find((p) => p.name === e.target.value))}
          >
            {planets.map((p) => (
              <option key={`2-${p.name}`} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Size Visualization */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Object 1 */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{object1.name}</span>
              <span className="text-sm text-gray-400">
                {object1.diameter ? `${object1.diameter.toLocaleString()} km` : "Unknown size"}
              </span>
            </div>
            <motion.div
              className="h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
              initial={{ width: 0 }}
              animate={{ width: `${object1Width}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="h-full flex items-center justify-center text-white font-medium">
                {object1Width.toFixed(0)}%
              </div>
            </motion.div>
          </div>
          
          {/* Comparison text for mobile */}
          <div className="md:hidden text-sm text-gray-400 my-2">
            {ratio !== "N/A" ? `${ratio}x difference` : "Cannot compare"}
          </div>
          
          {/* Object 2 */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{object2.name}</span>
              <span className="text-sm text-gray-400">
                {object2.diameter ? `${object2.diameter.toLocaleString()} km` : "Unknown size"}
              </span>
            </div>
            <motion.div
              className="h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-md"
              initial={{ width: 0 }}
              animate={{ width: `${object2Width}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="h-full flex items-center justify-center text-white font-medium">
                {object2Width.toFixed(0)}%
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-2 text-center">Comparison Result</h3>
        {ratio !== "N/A" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-750 p-3 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{ratio}x</div>
              <div className="text-sm text-gray-400">Size difference</div>
            </div>
            <div className="bg-gray-750 p-3 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">
                {object1.diameter.toLocaleString()} km
              </div>
              <div className="text-sm text-gray-400">{object1.name} diameter</div>
            </div>
            <div className="bg-gray-750 p-3 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">
                {object2.diameter.toLocaleString()} km
              </div>
              <div className="text-sm text-gray-400">{object2.name} diameter</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-yellow-400">
            Cannot compare sizes - diameter information missing for one or both objects
          </div>
        )}
      </div>

      {/* Additional Info */}
      {ratio !== "N/A" && (
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            {object1.diameter > object2.diameter ? (
              <>
                <span className="font-medium text-blue-400">{object1.name}</span> is{" "}
                <span className="font-medium">{ratio}</span> times larger in diameter than{" "}
                <span className="font-medium text-purple-400">{object2.name}</span>
              </>
            ) : (
              <>
                <span className="text-lg font-medium text-purple-400">{object2.name}</span> is{" "}
                <span className="text-lg font-medium">{(1/ratio).toFixed(2)}</span> times larger in diameter than{" "}
                <span className="text-lg font-medium text-blue-400">{object1.name}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default SizeComparison;