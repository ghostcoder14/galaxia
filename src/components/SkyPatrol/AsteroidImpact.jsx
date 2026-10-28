import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

const API_URL = "https://galaxia-2430.onrender.com/predict_impact";

const AsteroidImpact = () => {
  const [formData, setFormData] = useState({
    orbit_axis: 1.5,
    eccentricity: 0.3,
    inclination: 5.0,
    perihelion_distance: 0.8,
    aphelion_distance: 2.2,
    min_orbit_intersection_distance: 0.05,
    mean_anomaly: 120.5,
    perihelion_argument: 75.3,
    node_longitude: 110.2,
    orbital_period: 1.7,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltips, setShowTooltips] = useState({});

  const paramDescriptions = {
    orbit_axis: "Semi-major axis of orbit (AU)",
    eccentricity: "Orbital eccentricity (0-1)",
    inclination: "Orbital inclination (degrees)",
    perihelion_distance: "Closest distance to Sun (AU)",
    aphelion_distance: "Farthest distance from Sun (AU)",
    min_orbit_intersection_distance: "Minimum orbit intersection distance (AU)",
    mean_anomaly: "Mean anomaly (degrees)",
    perihelion_argument: "Argument of perihelion (degrees)",
    node_longitude: "Longitude of ascending node (degrees)",
    orbital_period: "Orbital period (years)"
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const toggleTooltip = (param) => {
    setShowTooltips(prev => ({ ...prev, [param]: !prev[param] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.post(API_URL, formData);
      
      let prediction;
      if (typeof response.data === 'number') {
        // If response is direct number (0 or 1)
        prediction = {
          impact_risk: response.data,
          prediction_probability: response.data === 1 ? 0.95 : 0.05 // Default confidence
        };
      } else if (response.data.prediction !== undefined) {
        // If response has 'prediction' field
        prediction = {
          impact_risk: response.data.prediction,
          prediction_probability: response.data.probability || 
                                 (response.data.prediction === 1 ? 0.95 : 0.05)
        };
      } else {
        // Fallback to assuming the old format
        prediction = response.data;
      }

      setResult(prediction);
      
    } catch (error) {
      console.error("Prediction Error:", error);
      let errorMsg = "Failed to get prediction. Please try again.";
      
      if (error.response) {
        errorMsg = `Server error: ${error.response.status}`;
        if (error.response.data) {
          errorMsg += ` - ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.request) {
        errorMsg = "No response from server. Check your connection.";
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 mt-17 mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          Asteroid Impact Predictor
        </h2>
        <p className="text-gray-400 mt-1">
          Enter orbital parameters to assess potential Earth impact risk
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.keys(formData).map((key) => (
          <div key={key} className="relative">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1">
                {key.replace(/_/g, " ")}
                <button 
                  onClick={() => toggleTooltip(key)}
                  className="text-gray-500 hover:text-blue-400"
                >
                  <FiInfo size={14} />
                </button>
              </label>
              <span className="text-xs text-gray-500">{formData[key]}</span>
            </div>
            
            <input
              type="range"
              name={key}
              min={key === 'eccentricity' ? 0 : 0.1}
              max={key === 'eccentricity' ? 1 : key.includes('distance') ? 5 : 360}
              step="0.01"
              value={formData[key]}
              onChange={handleChange}
              className="w-full mt-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            
            {showTooltips[key] && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 p-2 mt-1 text-xs bg-gray-800 border border-gray-700 rounded shadow-lg text-yellow-50"
              >
                {paramDescriptions[key]}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
            loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'
          }`}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            "Calculate Impact Risk"
          )}
        </motion.button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300"
        >
          <p className="flex items-center gap-2">
            <FiAlertTriangle /> {error}
          </p>
        </motion.div>
      )}

      {result && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-lg border ${
              result.impact_risk === 1 
                ? "bg-red-900/20 border-red-700" 
                : "bg-green-900/20 border-green-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${
                result.impact_risk === 1 ? "text-red-400" : "text-green-400"
              }`}>
                {result.impact_risk === 1 ? <FiAlertTriangle /> : <FiCheckCircle />}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">
                  {result.impact_risk === 1 
                    ? "Potential Impact Detected!" 
                    : "No Immediate Threat"}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  Impact probability: {(result.prediction_probability * 100).toFixed(2)}%
                </p>
                {result.impact_risk === 1 && (
                  <p className="text-sm text-red-300 mt-2">
                    Warning: This asteroid shows characteristics of a potential impactor. Further observation recommended.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AsteroidImpact;