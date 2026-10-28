import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { FaUserAstronaut } from "react-icons/fa";

const GEMINI_API_KEY = "AIzaSyCRg_OnI_1FhlBsgbbI1uVdKIxh3QCr0pk";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const Astronauts = () => {
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [astronautDetails, setAstronautDetails] = useState({});
  const [facts, setFacts] = useState({ issFact: "", issPurpose: "" });

  useEffect(() => {
    const fetchAstronauts = async () => {
      try {
        const response = await axios.get("http://api.open-notify.org/astros.json");
        const data = response.data.people.filter((astro) => astro.craft === "ISS"); // Get only ISS astronauts
        setAstronauts(data);
        if (data.length > 0) fetchAstronautDetails(data);
      } catch (error) {
        console.error("Error fetching astronauts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAstronauts();
    fetchISSTopics(); // Fetch educational facts
  }, []);

  const fetchISSTopics = async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const [issFact, issPurpose] = await Promise.all([
        model.generateContent("Give me an interesting fact about the International Space Station in one line."),
        model.generateContent("What is the main purpose of the International Space Station? Give a brief one-line answer."),
      ]);

      setFacts({
        issFact: issFact.response.text(),
        issPurpose: issPurpose.response.text(),
      });
    } catch (error) {
      console.error("Error fetching ISS facts:", error);
    }
  };

  const fetchAstronautDetails = async (astronauts) => {
    const details = {};
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    for (const astronaut of astronauts) {
      try {
        const response = await model.generateContent(`
          Provide engaging and factual details about the astronaut ${astronaut.name}, currently onboard the ISS.
          - Nationality
          - Current Research on ISS
          - Fun fact about their career or personal achievements
          Response should be concise and easy to understand in one line and less than 50 words.
        `);
        details[astronaut.name] = response.response.text();
      } catch (error) {
        console.error(`Error fetching details for ${astronaut.name}:`, error);
        details[astronaut.name] = "Details unavailable.";
      }
    }
    setAstronautDetails(details);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaUserAstronaut className="text-blue-400" />
        Astronauts Onboard the International Space Station (ISS)
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : astronauts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {astronauts.map((astro, index) => (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                <FaUserAstronaut className="text-blue-400" />
                <h3 className="text-lg font-semibold">{astro.name}</h3>
              </div>
              <p className="text-blue-300">
                {astronautDetails[astro.name] || "Fetching details..."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No astronauts are currently onboard the ISS.</p>
      )}

      {/* Educational Section */}
      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Did You Know? 🌌</h3>
        <p className="text-gray-300">{facts.issFact || "Fetching fact..."}</p>
        <p className="text-gray-300 mt-2">{facts.issPurpose || "Fetching purpose..."}</p>
      </div>
    </div>
  );
};

export default Astronauts;
