import React, { useEffect, useState } from "react";
import axios from "axios";
import IssTracker2D from "./IssTracker2D";
import IssTracker3D from "./IssTracker3D";
import { FaLocationPin, FaMountain, FaEarthAmericas, FaMapLocation } from "react-icons/fa6";
import { IoIosSpeedometer } from "react-icons/io";

const API_KEY = "67dd4090ddc46233797831rng7a3e9b"

const getTimestamps = () => {
  const now = Math.floor(Date.now() / 1000);
  return Array.from({ length: 13 }, (_, i) => now - 5400 + i * 900).join(",");
};

const IssTracker = () => {
  const [position, setPosition] = useState({ lat: 0, lon: 0 });
  const [issData, setIssData] = useState({
    altitude: "Loading...",
    velocity: "Loading...",
    country: "Loading...",
  });
  const [pathData, setPathData] = useState([]);
  const [showPath, setShowPath] = useState(true);
  const [viewMode, setViewMode] = useState("2D");
  const [country, setCountry] = useState("Loading...");

  const fetchISSLocation = async () => {
    try {
      const response = await axios.get(
        "http://api.open-notify.org/iss-now.json"
      );
      setPosition({
        lat: parseFloat(response.data.iss_position.latitude),
        lon: parseFloat(response.data.iss_position.longitude),
      });
    } catch (error) {
      console.error("Error fetching ISS location:", error);
    }
  };

  const fetchISSData = async () => {
    try {
      const response = await axios.get(
        "https://api.wheretheiss.at/v1/satellites/25544"
      );
      setIssData({
        altitude: response.data.altitude.toFixed(2),
        velocity: response.data.velocity.toFixed(2),
        country: response.data.visibility,
      });
    } catch (error) {
      console.error("Error fetching ISS data:", error);
    }
  };

  const fetchISSPath = async () => {
    try {
      const response = await axios.get(
        `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${getTimestamps()}`
      );
      setPathData(response.data.map((pos) => [pos.latitude, pos.longitude]));
    } catch (error) {
      console.error("Error fetching ISS path data:", error);
    }
  };

  const fetchLocation = async () => {
    try{
      const response = await axios.get(
        `https://geocode.maps.co/reverse?lat=${position.lat}&lon=${position.lon}&api_key=${API_KEY}`
      );
      console.log(response)
      setCountry(response.data.address.country || response.data.address.man_made);
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  }

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(() => {
      fetchLocation();
    }, 17000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchISSLocation();
    fetchISSData();
    fetchISSPath();
    const interval = setInterval(() => {
      fetchISSLocation();
      fetchISSData();
      fetchISSPath();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">
        🛰️ Live ISS Tracker
      </h1>

      <div className="flex w-full h-[70vh]">
        {/* Render Based on View Mode */}
        {viewMode === "2D" ? (
          <IssTracker2D
            position={position}
            issData={issData}
            pathData={pathData}
            showPath={showPath}
          />
        ) : (
          <IssTracker3D
            position={position}
          />
        )}

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center w-full lg:w-1/3 mt-4 lg:mt-0 lg:ml-4">
          <div className="flex gap-2">
            {viewMode === "2D" && <button
              onClick={() => setShowPath(!showPath)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mb-4"
            >
              {showPath ? "Hide Path" : "Show Path"}
            </button>}
            {/* Toggle Button */}
            <button
              onClick={() => setViewMode(viewMode === "2D" ? "3D" : "2D")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
            >
              {viewMode === "2D" ? "Switch to 3D View" : "Switch to 2D View"}
            </button>
          </div>

          <p className="text-lg flex gap-1.5 items-center">
            <FaLocationPin /> <strong>Current Location :</strong>{" "}
            {position.lat.toFixed(3)}, {position.lon.toFixed(3)}
          </p>
          <p className="text-lg flex gap-1.5 items-center">
            <FaMapLocation /> <strong>Region :</strong>{" "}
            {country || "Unknown"}
          </p>
          <p className="text-lg flex gap-1.5 items-center">
            <FaMountain /> <strong>Altitude :</strong> {issData.altitude} km
          </p>
          <p className="text-lg flex gap-1.5 items-center">
            <IoIosSpeedometer /> <strong>Speed :</strong> {issData.velocity} km/h
          </p>
          <p className="text-lg flex gap-1.5 items-center">
            <FaEarthAmericas /> <strong>Country Overpass :</strong>{" "}
            {issData.country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IssTracker;
