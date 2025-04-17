# Deploying the React + Vite Math Simulations Gallery to GitHub Pages

Follow these steps to deploy this React + Vite-based Math Simulations Gallery to your GitHub Pages root domain:

## Deployment Steps

### 1. Create a Special Repository

Create a new repository specifically named `tiktekteam.github.io` (where "tiktekteam" is your actual GitHub username).

### 2. Clone and Set Up the Repository

```bash
# Clone the repository
git clone https://github.com/tiktekteam/tiktekteam.github.io.git
cd tiktekteam.github.io

# Navigate to the Vite project directory
cd temp-vite

# Install dependencies
npm install
```

### 3. Configure for GitHub Pages Deployment

1. Make sure your package.json has the correct homepage field:
   ```json
   "homepage": "https://tiktekteam.github.io",
   ```

2. Ensure you have the gh-pages package installed:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deployment scripts to package.json (these should already be in place):
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

### 4. Set Up GitHub Actions for Automatic Deployment

The repository already includes a GitHub Actions workflow file (`.github/workflows/generate-manifest.yml`) that:

1. Builds the Vite React application
2. Generates the simulations manifest
3. Deploys to GitHub Pages

Make sure this file is present and correctly configured. The workflow is set up to:
- Navigate to the temp-vite directory
- Install dependencies
- Copy simulation files to the public directory
- Generate the manifest.json file
- Build the Vite application
- Deploy the dist directory to the gh-pages branch

### 5. Push Your Changes

```bash
# Add all files
git add .

# Commit the changes
git commit -m "Set up React Math Simulations Gallery"

# Push to GitHub
git push -u origin main
```

### 6. Verify GitHub Actions

1. Go to the "Actions" tab in your repository
2. Verify that the "Build and Deploy Vite React App" workflow has run successfully
3. If it hasn't run automatically, you can manually trigger it by clicking on "Run workflow"

For detailed instructions on enabling and troubleshooting GitHub Actions, see [SOLUTION_GITHUB_ACTIONS.md](SOLUTION_GITHUB_ACTIONS.md).

### 7. Access Your Site

Your site will be available directly at: `https://tiktekteam.github.io/`

## Troubleshooting

If your site doesn't appear or doesn't update:

1. Check that your repository is public (GitHub Pages requires this for free accounts)
2. Verify that the GitHub Actions workflow has the necessary permissions
3. Make sure your branch name matches what's specified in the workflow file (main)
4. Check the Actions tab for any error messages
5. Ensure the workflow is deploying to the gh-pages branch
6. Verify that GitHub Pages is set to deploy from the gh-pages branch in your repository settings

## Adding Custom Domain (Optional)

If you want to use a custom domain:

1. Go to repository Settings > Pages
2. Under "Custom domain", enter your domain name
3. Update DNS settings with your domain provider
4. Add a CNAME file to your `public` directory with your domain name
5. Update the homepage field in package.json to your custom domain
