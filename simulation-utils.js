// simulation-utils.js
const { decodePrivateData } = require('./crypto-config');

// Function to get private data from a simulation
function getSimulationPrivateData(simulation) {
  if (!simulation || !simulation._private) {
    return null;
  }

  // Handle both old string format and new object format with iv and data
  if (typeof simulation._private === 'string') {
    // Old format (string)
    return decodePrivateData(simulation._private);
  } else if (simulation._private.iv && simulation._private.data) {
    // New format (object with iv and data)
    return decodePrivateData(simulation._private);
  } else {
    console.error('Unknown private data format');
    return null;
  }
}

module.exports = {
  getSimulationPrivateData
};
