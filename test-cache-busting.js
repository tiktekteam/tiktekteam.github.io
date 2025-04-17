const fs = require('fs');
const path = require('path');

// Configuration
const manifestFile = './simulations/manifest.json';
const indexFile = './index.html';

// Function to test the cache-busting implementation
function testCacheBusting() {
    try {
        console.log('Testing cache-busting implementation...');
        
        // Check if the manifest file exists
        if (!fs.existsSync(manifestFile)) {
            console.error(`Error: Manifest file '${manifestFile}' does not exist.`);
            process.exit(1);
        }
        
        // Check if the index.html file exists
        if (!fs.existsSync(indexFile)) {
            console.error(`Error: Index file '${indexFile}' does not exist.`);
            process.exit(1);
        }
        
        // Read the index.html file
        const indexContent = fs.readFileSync(indexFile, 'utf8');
        
        // Check for cache-busting mechanisms
        const checks = [
            { name: 'Cache-Control meta tag', regex: /<meta\s+http-equiv="Cache-Control"/ },
            { name: 'Pragma meta tag', regex: /<meta\s+http-equiv="Pragma"/ },
            { name: 'Expires meta tag', regex: /<meta\s+http-equiv="Expires"/ },
            { name: 'Cache-busting in fetch URL', regex: /manifest\.json\?.*\$\{cacheBuster\}/ },
            { name: 'Cache-busting in simulation links', regex: /\$\{simulationsPath\}\$\{file\}\?\$\{cacheBuster\}/ },
            { name: 'Fetch with no-cache headers', regex: /'Cache-Control':\s*'no-cache, no-store, must-revalidate'/ },
            { name: 'Manual refresh button', regex: /<button\s+id="refresh-button"/ },
            { name: 'Auto-refresh mechanism', regex: /setInterval\(\s*\(\)\s*=>/ }
        ];
        
        let allPassed = true;
        
        // Run the checks
        checks.forEach(check => {
            const passed = check.regex.test(indexContent);
            console.log(`${passed ? '✅' : '❌'} ${check.name}: ${passed ? 'PASSED' : 'FAILED'}`);
            if (!passed) allPassed = false;
        });
        
        // Summary
        if (allPassed) {
            console.log('\n✅ All cache-busting mechanisms are in place!');
            console.log('The page should now properly refresh the simulation list and prevent caching issues.');
        } else {
            console.log('\n❌ Some cache-busting mechanisms are missing.');
            console.log('Please review the index.html file to ensure all mechanisms are properly implemented.');
        }
        
    } catch (error) {
        console.error(`❌ Error testing cache-busting: ${error.message}`);
        process.exit(1);
    }
}

// Run the function
testCacheBusting();