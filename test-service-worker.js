const fs = require('fs');
const path = require('path');

// Configuration
const indexFile = './index.html';
const serviceWorkerFile = './service-worker.js';
const redirectFile = './index-redirect.html';

// Function to test the service worker implementation
function testServiceWorker() {
    try {
        console.log('Testing service worker implementation...');
        
        // Check if the files exist
        const files = [indexFile, serviceWorkerFile, redirectFile];
        files.forEach(file => {
            if (!fs.existsSync(file)) {
                console.error(`Error: File '${file}' does not exist.`);
                process.exit(1);
            }
        });
        
        // Read the files
        const indexContent = fs.readFileSync(indexFile, 'utf8');
        const serviceWorkerContent = fs.readFileSync(serviceWorkerFile, 'utf8');
        const redirectContent = fs.readFileSync(redirectFile, 'utf8');
        
        // Check for service worker registration in index.html
        const checks = [
            { 
                name: 'Service Worker Registration', 
                file: 'index.html',
                regex: /navigator\.serviceWorker\.register\(['"]\/service-worker\.js['"]\)/ 
            },
            { 
                name: 'Cache Clearing Function', 
                file: 'index.html',
                regex: /window\.clearCacheAndReload\s*=\s*function/ 
            },
            { 
                name: 'Version Meta Tag', 
                file: 'index.html',
                regex: /<meta\s+name="version"\s+content="[^"]+">/ 
            },
            { 
                name: 'Version Check Script', 
                file: 'index.html',
                regex: /const\s+currentVersion\s*=\s*['"][^'"]+['"]/ 
            },
            { 
                name: 'Refresh Button Using Service Worker', 
                file: 'index.html',
                regex: /if\s*\(window\.clearCacheAndReload\)/ 
            },
            { 
                name: 'Never Cache List', 
                file: 'service-worker.js',
                regex: /const\s+NEVER_CACHE\s*=\s*\[/ 
            },
            { 
                name: 'Network First Strategy', 
                file: 'service-worker.js',
                regex: /NEVER_CACHE\.some\(file\s*=>\s*requestPath\.includes\(file\)\)/ 
            },
            { 
                name: 'Cache Clearing Message Handler', 
                file: 'service-worker.js',
                regex: /event\.data\.type\s*===\s*['"]CLEAR_CACHE['"]/ 
            },
            { 
                name: 'Redirect with Cache Buster', 
                file: 'index-redirect.html',
                regex: /window\.location\.href\s*=\s*`index\.html\?\$\{cacheBuster\}`/ 
            },
            { 
                name: 'LocalStorage Clearing', 
                file: 'index-redirect.html',
                regex: /localStorage\.clear\(\)/ 
            }
        ];
        
        let allPassed = true;
        
        // Run the checks
        checks.forEach(check => {
            const content = check.file === 'index.html' ? indexContent : 
                           (check.file === 'service-worker.js' ? serviceWorkerContent : redirectContent);
            const passed = check.regex.test(content);
            console.log(`${passed ? '✅' : '❌'} ${check.name} (${check.file}): ${passed ? 'PASSED' : 'FAILED'}`);
            if (!passed) allPassed = false;
        });
        
        // Summary
        if (allPassed) {
            console.log('\n✅ All service worker and cache-busting mechanisms are in place!');
            console.log('The page should now properly refresh and prevent caching issues on GitHub Pages.');
        } else {
            console.log('\n❌ Some service worker or cache-busting mechanisms are missing.');
            console.log('Please review the files to ensure all mechanisms are properly implemented.');
        }
        
    } catch (error) {
        console.error(`❌ Error testing service worker: ${error.message}`);
        process.exit(1);
    }
}

// Run the function
testServiceWorker();