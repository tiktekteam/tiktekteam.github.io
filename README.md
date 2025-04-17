# Math Simulations Gallery (React Version)

This repository hosts a collection of interactive math simulations using React and GitHub Pages. The site automatically generates a list of all simulations in the `simulations` directory.

## Live Demo

Visit the live site at: https://tiktekteam.github.io/

Deploy this site to your GitHub Pages root domain by following the instructions in [DEPLOYMENT.md](DEPLOYMENT.md).

## How It Works

1. All math simulation HTML files are stored in the `simulations` directory
2. A GitHub Actions workflow automatically generates a `manifest.json` file listing all HTML files in the directory
3. The React application loads this manifest and dynamically creates a list of links to all simulations
4. Users can click on any simulation to view and interact with it in an iframe

## Adding New Simulations

To add a new math simulation:

1. Create a new HTML file in the `simulations` directory
2. Make sure your simulation is self-contained in a single HTML file
3. Include a link back to the main page: `<a href="/">Back to All Simulations</a>`
4. Push your changes to the repository
5. The GitHub Actions workflow will automatically update the manifest, build the React app, and deploy it to GitHub Pages

## Technical Details

### React Implementation

This site is built with React, which provides several advantages:

1. **Component-Based Architecture**: The UI is broken down into reusable components
2. **Virtual DOM**: React's virtual DOM ensures efficient updates and rendering
3. **React Router**: Client-side routing provides a smooth navigation experience
4. **State Management**: React's state management ensures consistent UI updates
5. **Modern JavaScript**: Uses ES6+ features for cleaner, more maintainable code

### Automatic List Generation

The list of simulations is automatically generated using:

1. A GitHub Actions workflow (`.github/workflows/generate-manifest.yml`) that runs whenever changes are pushed
2. The workflow scans the directory for HTML files and creates/updates a `manifest.json` file
3. The React application fetches this manifest and builds the list dynamically

If you're having issues with the GitHub Actions workflow, see [SOLUTION_GITHUB_ACTIONS.md](SOLUTION_GITHUB_ACTIONS.md) for troubleshooting steps.

### File Structure

```
├── public/                 # Static files
│   ├── index.html          # HTML entry point
│   ├── manifest.json       # Web app manifest
│   └── simulations/        # Simulation files
│       ├── manifest.json   # Auto-generated list of simulations
│       ├── parabole-meets-different-lines.html
│       ├── subtracting-negative-number.html
│       └── [other-simulation].html
├── src/                    # React source code
│   ├── components/         # React components
│   │   ├── SimulationList.js    # List of simulations
│   │   ├── SimulationList.css
│   │   ├── SimulationFrame.js   # Iframe for viewing simulations
│   │   └── SimulationFrame.css
│   ├── App.js              # Main React component
│   ├── App.css             # Styles for App component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── scripts/                # Build and utility scripts
│   └── generateManifest.js # Script to generate manifest.json
├── package.json            # NPM package configuration
├── README.md               # This documentation
├── DEPLOYMENT.md           # Instructions for deploying to GitHub Pages
├── SOLUTION_GITHUB_ACTIONS.md # Troubleshooting guide for GitHub Actions
└── .github/
    └── workflows/
        └── generate-manifest.yml  # GitHub Actions workflow
```

### Cache-Busting Implementation

To ensure users always see the latest content, this React application implements several cache-busting mechanisms:

1. **Cache-Control Headers**: HTTP headers instruct browsers not to cache critical files
2. **Query Parameters**: Dynamic cache-busting parameters are added to all simulation URLs
3. **Periodic Auto-Refresh**: The app automatically refreshes the simulations list every 5 minutes
4. **Manual Refresh Button**: Users can manually refresh the simulations list
5. **React's Virtual DOM**: Ensures efficient updates when new data is fetched

## Local Development

To run this site locally:

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create the simulations directory in public:
   ```
   mkdir -p public/simulations
   cp -r simulations/* public/simulations/
   ```
4. Generate the manifest:
   ```
   node scripts/generateManifest.js
   ```
5. Start the development server:
   ```
   npm start
   ```
6. Open http://localhost:3000 in your browser

### Building for Production

To build the site for production:

1. Run the build command:
   ```
   npm run build
   ```
2. The built files will be in the `build` directory
3. You can deploy these files to any static hosting service

## License

This project is open source and available under the [MIT License](LICENSE).
