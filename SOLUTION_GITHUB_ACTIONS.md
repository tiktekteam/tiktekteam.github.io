# GitHub Actions Troubleshooting Guide for React + Vite App

This document provides solutions for common issues with the GitHub Actions workflow that builds and deploys the React + Vite application.

## Common Issues and Solutions

### 1. Workflow Not Running

**Symptoms:**
- The "Build and Deploy Vite React App" workflow doesn't run when you push changes
- No workflow runs appear in the Actions tab

**Solutions:**
- Verify that GitHub Actions is enabled for your repository:
  1. Go to your repository on GitHub
  2. Click on "Settings" → "Actions" → "General"
  3. Ensure "Allow all actions and reusable workflows" is selected
  4. Click "Save"
- Check that you're pushing to the correct branch (main)
- Manually trigger the workflow:
  1. Go to the "Actions" tab
  2. Select "Build and Deploy React App" workflow
  3. Click "Run workflow" and select your branch

### 2. Workflow Runs But Doesn't Deploy

**Symptoms:**
- The workflow runs successfully but the site doesn't update
- You see no new commits to the gh-pages branch

**Solutions:**
- **Permission Issue (Most Common)**: GitHub has tightened security on workflow tokens
  1. Go to your repository Settings → Actions → General
  2. Scroll down to "Workflow permissions"
  3. Select "Read and write permissions"
  4. Save the changes
- Verify the permissions in the workflow file:
  ```yaml
  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      permissions:
        contents: write
      # rest of job configuration...
  ```
- Check that the GitHub Pages deployment action is correctly configured:
  ```yaml
  - name: Deploy to GitHub Pages
    uses: JamesIves/github-pages-deploy-action@4.1.5
    with:
      branch: gh-pages
      folder: build
      clean: true
  ```

### 3. Build Fails with Node.js or NPM Errors

**Symptoms:**
- Workflow fails during the build step
- Errors related to Node.js modules or dependencies

**Solutions:**
- Check the error message in the workflow run logs
- Ensure all dependencies are correctly listed in package.json
- Try updating the Node.js version in the workflow file:
  ```yaml
  - name: Set up Node.js
    uses: actions/setup-node@v2
    with:
      node-version: '16'
  ```
- Add a step to debug Node.js and NPM versions:
  ```yaml
  - name: Debug environment
    run: |
      node --version
      npm --version
      npm list --depth=0
  ```

### 4. Simulations Not Found in Deployed App

**Symptoms:**
- The React app deploys successfully but simulations are not listed
- Error messages about missing manifest.json or simulations

**Solutions:**
- Verify the simulations directory is correctly copied to the public directory:
  ```yaml
  - name: Create simulations directory
    run: |
      mkdir -p public/simulations
      cp -r simulations/* public/simulations/
  ```
- Check that the manifest generator script is running correctly:
  ```yaml
  - name: Generate manifest.json
    run: |
      node scripts/generateManifest.js
  ```
- Add debugging steps to verify file existence:
  ```yaml
  - name: Debug files
    run: |
      ls -la public/simulations/
      cat public/simulations/manifest.json
  ```

### 5. GitHub Pages Not Serving the React App Correctly

**Symptoms:**
- The site loads but shows a blank page or 404 errors
- Console errors about missing JavaScript or CSS files

**Solutions:**
- Ensure the homepage field in package.json is correctly set:
  ```json
  "homepage": "https://tiktekteam.github.io",
  ```
- For React Router to work correctly, you may need to use HashRouter instead of BrowserRouter:
  ```jsx
  import { HashRouter as Router } from 'react-router-dom';
  ```
- Check that GitHub Pages is set to deploy from the gh-pages branch:
  1. Go to repository Settings → Pages
  2. Under "Source", select "gh-pages" branch
  3. Click "Save"

## Verifying the Workflow Configuration

The current workflow configuration includes:

1. **Explicit Permissions**: The workflow has `contents: write` permission to allow deployment
2. **Manual Trigger Option**: You can manually trigger the workflow using the "workflow_dispatch" event
3. **Automatic Trigger**: The workflow runs automatically on pushes to the main branch
4. **Node.js Setup**: Uses Node.js 16 for modern JavaScript support
5. **Dependency Installation**: Installs all required NPM packages
6. **Simulations Directory Setup**: Copies simulations to the public directory
7. **Manifest Generation**: Runs the script to generate the manifest.json file
8. **React Build**: Builds the React application for production
9. **GitHub Pages Deployment**: Deploys the built files to the gh-pages branch

To verify your workflow configuration is correct, compare it with this example:

```yaml
name: Build and Deploy React App

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Allow manual triggering

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: Install dependencies
        run: npm install

      - name: Create simulations directory
        run: |
          mkdir -p public/simulations
          cp -r simulations/* public/simulations/

      - name: Generate manifest.json
        run: |
          node scripts/generateManifest.js

      - name: Build React app
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@4.1.5
        with:
          branch: gh-pages
          folder: build
          clean: true
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment/#github-pages)
- [React Router and GitHub Pages](https://create-react-app.dev/docs/deployment/#notes-on-client-side-routing)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Troubleshooting GitHub Actions](https://docs.github.com/en/actions/troubleshooting)
