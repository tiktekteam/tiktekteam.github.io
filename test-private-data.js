// test-private-data.js
const fs = require('fs');
const { getSimulationPrivateData } = require('./simulation-utils');

// Load simulations.json
const simulationsData = JSON.parse(fs.readFileSync('./simulations.json', 'utf8'));

// Get the first simulation
const simulation = simulationsData.simulations[0];

console.log('Simulation:', simulation.title);
console.log('Path:', simulation.path);
console.log('Description:', simulation.description);

// Try to get the private data
const privateData = getSimulationPrivateData(simulation);

if (privateData) {
  console.log('\nPrivate data successfully decoded:');
  console.log('Created at:', privateData.createdAt);
  console.log('Author:', privateData.author);
  console.log('Difficulty:', privateData.difficulty);
  console.log('Tags:', privateData.tags.join(', '));
  console.log('Internal notes:', privateData.internalNotes);
} else {
  console.log('\nFailed to decode private data');
}