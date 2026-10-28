// NasaNeoFeed.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AsteroidImpact from "./AsteroidImpact";

const formatDate = (date) => date.toISOString().split("T")[0];

function Asteroid3D({ asteroid, onClick }) {
  const meshRef = useRef();
  let baseDistance = 15;
  if (asteroid.close_approach_data?.length > 0) {
    const missKm = parseFloat(
      asteroid.close_approach_data[0].miss_distance.kilometers
    );
    baseDistance = Math.max(missKm / 1000000, 3.5);
  }
  const theta = Math.random() * 2 * Math.PI;
  const phi = Math.acos(2 * Math.random() - 1);
  const x = baseDistance * Math.sin(phi) * Math.cos(theta);
  const y = baseDistance * Math.sin(phi) * Math.sin(theta);
  const z = baseDistance * Math.cos(phi);
  const position = [x, y, z];

  const texture = useLoader(THREE.TextureLoader, "/textures/asteroid.jpeg");
  const bumpMap = useLoader(THREE.TextureLoader, "/textures/asteroid_bump.jpg");

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.y += 0.004;
      meshRef.current.position.y = y + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={position} onClick={() => onClick(asteroid)}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={bumpMap}
          bumpScale={0.2}
          roughness={1}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + 1.2, position[2]]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {asteroid.name}
      </Text>
    </group>
  );
}

// Main Component
const NasaNeoFeed = () => {
  // Date state for header controls
  const [uiStartDate, setUiStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  const [uiEndDate, setUiEndDate] = useState(new Date());
  // Query state: when applied, these are used for the API call.
  const [queryStartDate, setQueryStartDate] = useState(null);
  const [queryEndDate, setQueryEndDate] = useState(null);

  // Data state
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Selected asteroid to show details in the sidebar.
  const [selectedAsteroid, setSelectedAsteroid] = useState(null);

  // Sidebar open state (right sidebar)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const API_KEY = "ovQtHry5RPTUZ98ebIwaZ5ZKAWjIdAcntQa6gRGd"; // Replace with your API key

  // Fetch feed when query dates change; if no query, fetch default (all asteroids)
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        let url = `https://api.nasa.gov/neo/rest/v1/feed?api_key=${API_KEY}`;
        if (queryStartDate && queryEndDate) {
          url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${formatDate(
            queryStartDate
          )}&end_date=${formatDate(queryEndDate)}&api_key=${API_KEY}`;
        }
        const response = await axios.get(url);
        setFeed(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [queryStartDate, queryEndDate, API_KEY]);

  // Flatten asteroids from all days in the feed
  let asteroids = [];
  if (feed?.near_earth_objects) {
    Object.values(feed.near_earth_objects).forEach((dayAsteroids) => {
      asteroids = asteroids.concat(dayAsteroids);
    });
  }

  // Handler to apply the selected date range (max 7 days)
  const handleApplyDates = () => {
    setQueryStartDate(uiStartDate);
    setQueryEndDate(uiEndDate);
  };

  // Handler for when an asteroid is clicked (either on canvas or in list)
  const handleSelectAsteroid = useCallback((asteroid) => {
    setSelectedAsteroid(asteroid);
    // Ensure sidebar is open when an asteroid is selected
    setSidebarOpen(true);
  }, []);

  return (
    <>
      <AppBar
        position="absolute"
        sx={{
          top: "10px",
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Translucent black
          backdropFilter: "blur(10px)", // Optional: Blurred background effect
          zIndex: 10, // Ensures it stays above other elements
          width: "30vw",
          padding: "5px",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={uiStartDate}
                onChange={(newDate) => newDate && setUiStartDate(newDate)}
                maxDate={new Date()}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1,
                }}
                slotProps={{
                  textField: {
                    InputLabelProps: { style: { color: "white" } },
                    InputProps: { style: { color: "white" } },
                  },
                }}
              />
              <DatePicker
                label="End Date"
                value={uiEndDate}
                onChange={(newDate) => newDate && setUiEndDate(newDate)}
                minDate={uiStartDate}
                maxDate={
                  new Date(uiStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                }
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 1,
                }}
                slotProps={{
                  textField: {
                    InputLabelProps: { style: { color: "white" } },
                    InputProps: { style: { color: "white" } },
                  },
                }}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleApplyDates}
            >
              Apply
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Box sx={{ position: "relative", height: "calc(100vh - 64px)" }}>
        {/* 3D Canvas */}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
          >
            <CircularProgress size={50} sx={{ color: "#ffffff" }} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            Error: {error.message}
          </Typography>
        ) : (
          <Canvas style={{ height: "100vh", background: "black" }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <Stars radius={100} depth={50} count={5000} factor={4} fade />
            <OrbitControls enableZoom={true} />
            {asteroids.map((asteroid) => (
              <Asteroid3D
                key={asteroid.id}
                asteroid={asteroid}
                onClick={handleSelectAsteroid}
              />
            ))}
          </Canvas>
        )}

        {/* Right Sidebar: List of Asteroids and Details */}
        <Drawer
          anchor="right"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        >
          <Box
            sx={{
              width: 350,
              p: 2,
              backgroundColor: "#222",
              color: "white",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Asteroid List</Typography>
              <IconButton
                onClick={() => setSidebarOpen(false)}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, overflowY: "auto", maxHeight: "50vh" }}>
              {asteroids.map((asteroid) => (
                <Box
                  key={asteroid.id}
                  sx={{
                    p: 1,
                    borderBottom: "1px solid #444",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#333" },
                  }}
                  onClick={() => handleSelectAsteroid(asteroid)}
                >
                  <Typography variant="body1">{asteroid.name}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              {selectedAsteroid ? (
                <>
                  <Typography variant="h5">{selectedAsteroid.name}</Typography>
                  <Typography variant="body1">
                    <strong>Diameter:</strong>{" "}
                    {(
                      (selectedAsteroid.estimated_diameter.kilometers
                        .estimated_diameter_min +
                        selectedAsteroid.estimated_diameter.kilometers
                          .estimated_diameter_max) /
                      2
                    ).toFixed(2)}{" "}
                    km
                  </Typography>
                  <Typography variant="body1">
                    <strong>Velocity:</strong>{" "}
                    {parseFloat(
                      selectedAsteroid.close_approach_data[0].relative_velocity
                        .kilometers_per_hour
                    ).toFixed(2)}{" "}
                    km/h
                  </Typography>
                  <Typography variant="body1">
                    <strong>Orbiting:</strong>{" "}
                    {selectedAsteroid.close_approach_data[0].orbiting_body}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Magnitude:</strong>{" "}
                    {selectedAsteroid.absolute_magnitude_h}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Hazardous:</strong>{" "}
                    {selectedAsteroid.is_potentially_hazardous_asteroid
                      ? "Yes"
                      : "No"}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" align="center">
                  Click an asteroid for details.
                </Typography>
              )}
            </Box>
          </Box>
        </Drawer>
      </Box>
      <AsteroidImpact />
    </>
  );
};

export default NasaNeoFeed;
