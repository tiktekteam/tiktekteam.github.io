const fs = require('fs');
const path = require('path');

// Configuration
const manifestFile = './simulations/manifest.json';
const simulationsDir = './simulations';

// Function to test the manifest file
function testManifest() {
    try {
        // Check if the manifest file exists
        if (!fs.existsSync(manifestFile)) {
            console.error(`Error: Manifest file '${manifestFile}' does not exist.`);
            process.exit(1);
        }

        // Read the manifest file
        const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
        console.log(`✅ manifest.json contains ${manifest.length} simulations.`);
        console.log(`📋 Simulations in manifest:`);
        manifest.forEach(file => console.log(`   - ${file}`));

        // Read all HTML files in the simulations directory
        const files = fs.readdirSync(simulationsDir)
            .filter(file => file.endsWith('.html'))
            .sort(); // Sort alphabetically

        console.log(`\n📋 HTML files in simulations directory:`);
        files.forEach(file => console.log(`   - ${file}`));

        // Check if the manifest contains all HTML files
        const missingFiles = files.filter(file => !manifest.includes(file) && file !== 'test.html');
        if (missingFiles.length > 0) {
            console.error(`\n❌ The following HTML files are missing from the manifest:`);
            missingFiles.forEach(file => console.error(`   - ${file}`));
        } else {
            console.log(`\n✅ All HTML files are included in the manifest.`);
        }

        // Check if the manifest contains files that don't exist
        const nonExistentFiles = manifest.filter(file => !files.includes(file));
        if (nonExistentFiles.length > 0) {
            console.error(`\n❌ The following files in the manifest don't exist in the simulations directory:`);
            nonExistentFiles.forEach(file => console.error(`   - ${file}`));
        } else {
            console.log(`\n✅ All files in the manifest exist in the simulations directory.`);
        }
    } catch (error) {
        console.error(`❌ Error testing manifest: ${error.message}`);
        process.exit(1);
    }
}

// Run the function
testManifest();