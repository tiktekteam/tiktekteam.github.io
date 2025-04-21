# Automated Simulations.json Generation

This project includes an automated system for generating the `simulations.json` file based on the HTML files in the `simulations` directory.

## Features

- Automatically scans the `simulations` directory for HTML files
- Extracts titles from each file's `<title>` tag
- Generates descriptions based on the titles
- Adds encrypted private data to each simulation
- Updates the `simulations.json` file with the latest information

## Setup

1. Install the required dependencies:

```bash
npm install jsdom
```

2. Set up the pre-commit Git hook by following the instructions in `setup-git-hook.md`

## How It Works

The system consists of several components:

1. **crypto-config.js** - Contains encryption/decryption functions (this file is gitignored)
2. **generate-simulations.js** - The main script that generates the simulations.json file
3. **simulation-utils.js** - Utility functions for working with the simulations data
4. **Git pre-commit hook** - Automatically runs the generation script before each commit

## Private Data

Each simulation includes a `_private` field that contains encrypted data. This data is only accessible if you have the decryption key in `crypto-config.js`.

To access the private data in your code:

```javascript
const { getSimulationPrivateData } = require('./simulation-utils');

// Load simulations.json
const simulationsData = require('./simulations.json');

// Get a simulation
const simulation = simulationsData.simulations[0];

// Get the private data
const privateData = getSimulationPrivateData(simulation);

console.log(privateData);
// Output: { createdAt: '...', author: '...', difficulty: '...', ... }
```

## Manual Execution

If you need to update the `simulations.json` file manually (without committing), you can use the npm script:

```bash
npm run update-simulations
```

Or run the script directly:

```bash
node generate-simulations.js
```

To test the private data functionality:

```bash
npm run test-private-data
```

## Security Notes

- The `crypto-config.js` file contains the encryption key and should never be committed to the repository
- The encryption provides basic protection against casual users, but is not suitable for highly sensitive data
- For truly sensitive data, consider using a proper backend database with authentication
