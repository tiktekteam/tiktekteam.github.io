import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SimulationList from './components/SimulationList';
import SimulationFrame from './components/SimulationFrame';
import './App.css';

function App() {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  // Function to generate a unique cache-busting value
  const generateCacheBuster = () => {
    return `v=${new Date().getTime()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  // Function to fetch the list of simulations
  const fetchSimulations = async (isRefresh = false) => {
    if (isRefresh) {
      setLoading(true);
    }

    try {
      const cacheBuster = generateCacheBuster();
      const manifestUrl = `${process.env.PUBLIC_URL}/simulations/manifest.json?${cacheBuster}`;

      console.log(`Fetching manifest from: ${manifestUrl}`);

      const response = await fetch(manifestUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to load simulations list: ${response.status} ${response.statusText}`);
      }

      const files = await response.json();
      setSimulations(files);
      setLastUpdateTime(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching simulations:', err);
      setError('Failed to load simulations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch simulations on component mount
  useEffect(() => {
    fetchSimulations();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing simulations list...');
      fetchSimulations();
    }, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchSimulations(true);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>הדמיות</h1>
              <p>לחץ על הדמייה כדי להתחיל</p>

              <div className="refresh-container">
                <button onClick={handleRefresh}>
                  Refresh Simulations
                </button>
                {lastUpdateTime && (
                  <div className="timestamp">
                    Last updated: {lastUpdateTime.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <SimulationList 
                simulations={simulations} 
                loading={loading} 
                error={error} 
                cacheBuster={generateCacheBuster()}
              />
            </div>
          } />
          <Route path="/simulation/:name" element={<SimulationFrame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
