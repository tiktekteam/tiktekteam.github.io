const fs = require('fs');
const path = require('path');

// Configuration
const simulationsDir = './public/simulations';
const outputFile = './public/simulations/manifest.json';

// Function to generate the manifest file
function generateManifest() {
    try {
        // Check if the simulations directory exists
        if (!fs.existsSync(simulationsDir)) {
            console.error(`Error: Directory '${simulationsDir}' does not exist.`);
            process.exit(1);
        }

        // Read all files in the simulations directory
        const files = fs.readdirSync(simulationsDir)
            .filter(file => file.endsWith('.html'))
            .sort(); // Sort alphabetically

        // Write the manifest file
        fs.writeFileSync(outputFile, JSON.stringify(files, null, 2), 'utf8');
        
        console.log(`✅ manifest.json generated with ${files.length} simulations.`);
        console.log(`📋 Simulations included:`);
        files.forEach(file => console.log(`   - ${file}`));
    } catch (error) {
        console.error(`❌ Error generating manifest: ${error.message}`);
        process.exit(1);
    }
}

// Run the function
generateManifest();