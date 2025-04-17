import React from 'react';
import { Link } from 'react-router-dom';
import './SimulationList.css';

const SimulationList = ({ simulations, loading, error, cacheBuster }) => {
  // Function to format the display name
  const formatDisplayName = (fileName) => {
    return fileName
      .replace('.html', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <ul className="simulation-list"><li>Loading simulations...</li></ul>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <p>Please try refreshing the page or check your connection.</p>
      </div>
    );
  }

  if (!simulations || simulations.length === 0) {
    return <ul className="simulation-list"><li>No simulations found</li></ul>;
  }

  return (
    <ul className="simulation-list">
      {simulations.map((file, index) => (
        <li key={index}>
          <Link 
            to={`/simulation/${encodeURIComponent(file)}?${cacheBuster}`}
            className="simulation-link"
          >
            {formatDisplayName(file)}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SimulationList;