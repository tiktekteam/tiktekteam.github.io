import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './SimulationFrame.css';

const SimulationFrame = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract the cache buster from the URL query parameters
  const cacheBuster = location.search || `?v=${new Date().getTime()}`;
  
  // The full URL to the simulation
  const simulationUrl = `${process.env.PUBLIC_URL}/simulations/${name}${cacheBuster}`;

  // Handle back button click
  const handleBack = () => {
    navigate('/');
  };

  // Check if the simulation exists
  useEffect(() => {
    const checkSimulation = async () => {
      try {
        const response = await fetch(simulationUrl, {
          method: 'HEAD',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          setError(`Simulation not found: ${name}`);
        }
      } catch (err) {
        setError(`Error loading simulation: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    checkSimulation();
  }, [simulationUrl, name]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Handle iframe error event
  const handleIframeError = () => {
    setLoading(false);
    setError(`Failed to load simulation: ${name}`);
  };

  // Format the display name
  const displayName = name
    ? name
        .replace('.html', '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Simulation';

  return (
    <div className="simulation-container">
      <div className="simulation-header">
        <button onClick={handleBack} className="back-button">
          &larr; Back to All Simulations
        </button>
        <h1 className="simulation-title">{displayName}</h1>
      </div>
      
      {loading && <div className="loading">Loading simulation...</div>}
      
      {error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={handleBack} className="back-button">
            Return to Simulations List
          </button>
        </div>
      ) : (
        <iframe
          src={simulationUrl}
          title={displayName}
          className="simulation-frame"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </div>
  );
};

export default SimulationFrame;