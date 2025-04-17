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

### File Structure

```
├── index.html              # Main page that lists all simulations
├── _config.yml             # GitHub Pages configuration
├── README.md               # This documentation
├── generateManifest.js     # Node.js script to generate manifest locally
├── .github/
│   └── workflows/
│       └── generate-manifest.yml  # GitHub Actions workflow
└── simulations/
    ├── manifest.json       # Auto-generated list of simulations
    ├── pendulum-simulation.html
    ├── double-pendulum-simulation.html
    └── [other-simulation].html
```

## Local Development

To test this site locally:

1. Clone the repository
2. Open `index.html` in your browser
3. The page should display a list of all simulations in the `simulations` directory

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
