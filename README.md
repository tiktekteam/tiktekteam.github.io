# Math Simulations Gallery

This repository hosts a collection of interactive math simulations using GitHub Pages. The site automatically generates a list of all simulations in the `simulations` directory.

## Live Demo

Visit the live site at: https://tiktekteam.github.io/

Deploy this site to your GitHub Pages root domain by following the instructions in [DEPLOYMENT.md](DEPLOYMENT.md).

## How It Works

1. All math simulation HTML files are stored in the `simulations` directory
2. A GitHub Actions workflow automatically generates a `manifest.json` file listing all HTML files in the directory
3. The main `index.html` page loads this manifest and dynamically creates a list of links to all simulations
4. Users can click on any simulation to view and interact with it

## Adding New Simulations

To add a new math simulation:

1. Create a new HTML file in the `simulations` directory
2. Make sure your simulation is self-contained in a single HTML file
3. Include a link back to the main page: `<a href="../index.html">Back to All Simulations</a>`
4. Push your changes to the repository
5. The GitHub Actions workflow will automatically update the manifest and your simulation will appear in the list

## Technical Details

### Automatic List Generation

The list of simulations is automatically generated using:

1. A GitHub Actions workflow (`.github/workflows/generate-manifest.yml`) that runs whenever files in the `simulations` directory change
2. The workflow scans the directory for HTML files and creates/updates a `manifest.json` file
3. The main page's JavaScript code fetches this manifest and builds the list dynamically

If you're having issues with the GitHub Actions workflow not running or not generating the manifest file, see [SOLUTION_GITHUB_ACTIONS.md](SOLUTION_GITHUB_ACTIONS.md) for troubleshooting steps.

### File Structure

```
├── index.html              # Main page that lists all simulations
├── index-redirect.html     # Alternative entry point with cache clearing
├── service-worker.js       # Service worker for cache control
├── _config.yml             # GitHub Pages configuration
├── README.md               # This documentation
├── DEPLOYMENT.md           # Instructions for deploying to GitHub Pages
├── SOLUTION_GITHUB_ACTIONS.md # Troubleshooting guide for GitHub Actions
├── generateManifest.js     # Node.js script to generate manifest locally
├── test-manifest.js        # Test script for manifest validation
├── test-cache-busting.js   # Test script for cache-busting mechanisms
├── test-service-worker.js  # Test script for service worker implementation
├── .github/
│   └── workflows/
│       └── generate-manifest.yml  # GitHub Actions workflow
└── simulations/
    ├── manifest.json       # Auto-generated list of simulations
    ├── parabole-meets-different-lines.html
    ├── subtracting-negative-number.html
    └── [other-simulation].html
```

### Cache-Busting Implementation

To ensure users always see the latest content, this site implements several cache-busting mechanisms:

1. **Service Worker**: Intercepts network requests and ensures index.html and manifest.json are always fetched from the network
2. **Version Checking**: The site includes a version number that triggers a refresh when changed
3. **Cache-Control Headers**: HTTP headers instruct browsers not to cache critical files
4. **Query Parameters**: Dynamic cache-busting parameters are added to all URLs
5. **LocalStorage Clearing**: The redirect page clears localStorage to reset any stored state
6. **Periodic Auto-Refresh**: The site automatically refreshes the simulations list every 5 minutes

## Local Development

To test this site locally:

1. Clone the repository
2. Open `index.html` in your browser
3. The page should display a list of all simulations in the `simulations` directory

### Ensuring You See the Latest Version

This site implements several cache-busting mechanisms to ensure you always see the latest content:

1. **Refresh Button**: Click the "Refresh Simulations" button on the main page to force a refresh of the simulations list
2. **Alternative Entry Point**: Use `index-redirect.html` to load a fresh version of the site with cache clearing
3. **Manual Cache Clearing**: In your browser, use Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac) to force a full refresh
4. **Browser Developer Tools**: Open your browser's developer tools, go to the Application/Storage tab, and clear site data

### Generating Manifest Locally

If you add new simulations locally and want to update the manifest without pushing to GitHub:

1. Make sure you have Node.js installed
2. Run the provided script:
   ```
   node generateManifest.js
   ```
3. This will scan the `simulations` directory and update the `manifest.json` file
4. Refresh your browser to see the updated list of simulations

## License

This project is open source and available under the [MIT License](LICENSE).
