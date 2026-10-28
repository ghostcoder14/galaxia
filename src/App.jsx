import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NasaNeoFeedPage from "./pages/NasaNeoFeedPage";
import SpaceExploration from "./pages/SpaceExploration";
import SpaceMission from "./pages/SpaceMission";
import AllPayloads from "./pages/AllPayloads";
import Layout from "./components/Layout";
import ArrangePlanetsGame from "./components/games/ArrangePlanetsGame";
import CosmicQuiz from "./components/games/CosmicQuiz";
import StarMatch from './components/games/StarMatch';
import NebulaEscape from './components/games/NebulaEscape';
import CMEPage from "./pages/CMEPage";
import IssTrackerPage from "./pages/IssTrackerPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/sky-patrol" element={<NasaNeoFeedPage />} />
          <Route path="/solar-system" element={<SpaceExploration />} />
          <Route path="/spacemission" element={<SpaceMission />} />
          <Route path="/all-payloads" element={<AllPayloads />} />
          <Route path="/orbit-align" element={<ArrangePlanetsGame />} />
          <Route path="/cosmic-quiz" element={<CosmicQuiz />} />
          <Route path="/star-match" element={<StarMatch />} /> 
          <Route path="/nebula-escape" element={<NebulaEscape />} />
          <Route path="/solar-surge" element={<CMEPage />} />
          <Route path="/iss-tracker" element={<IssTrackerPage />} />
        </Route>
      </Routes>
  );
}

export default App;
