const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom'); // You'll need to install this: npm install jsdom

// Import the crypto functions from the gitignored file
const { encodePrivateData } = require('./crypto-config');

// Configuration
const SIMULATIONS_DIR = path.join(__dirname, 'simulations');
const OUTPUT_FILE = path.join(__dirname, 'simulations.json');

async function generateSimulationsJson() {
  try {
    // Get all HTML files in the simulations directory
    const files = fs.readdirSync(SIMULATIONS_DIR)
      .filter(file => file.endsWith('.html'));
    
    // Process each file to extract metadata
    const simulations = [];
    
    for (const file of files) {
      const filePath = path.join(SIMULATIONS_DIR, file);
      const relativePath = `simulations\\${file}`; // Using Windows backslashes
      
      // Read the HTML file
      const html = fs.readFileSync(filePath, 'utf8');
      
      // Parse the HTML to extract the title
      const dom = new JSDOM(html);
      const title = dom.window.document.querySelector('title')?.textContent || file;
      
      // Generate a description
      const description = `הדגמה של ${title}`;
      
      // Create private data object - customize this with whatever private data you need
      const privateData = {
        createdAt: new Date().toISOString(),
        author: 'Your Name',
        difficulty: 'medium',
        tags: ['math', 'visualization'],
        internalNotes: 'This simulation demonstrates...'
        // Add any other private fields you need
      };
      
      // Encode the private data
      const encodedPrivateData = encodePrivateData(privateData);
      
      simulations.push({
        path: relativePath,
        title,
        description,
        _private: encodedPrivateData // This will be in the JSON but not usable without the key
      });
    }
    
    // Create the JSON structure
    const simulationsJson = {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      simulations
    };
    
    // Write to the output file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(simulationsJson, null, 2), 'utf8');
    
    console.log(`Successfully generated ${OUTPUT_FILE} with ${simulations.length} simulations`);
  } catch (error) {
    console.error('Error generating simulations.json:', error);
  }
}

// Run the function
generateSimulationsJson();