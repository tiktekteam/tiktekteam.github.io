# GitHub Actions Troubleshooting Guide

This document provides solutions for common issues with the GitHub Actions workflow that generates the simulations manifest.

## Common Issues and Solutions

### 1. Workflow Not Running

**Symptoms:**
- The "Generate Simulations Manifest" workflow doesn't run when you push changes
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
  2. Select "Generate Simulations Manifest" workflow
  3. Click "Run workflow" and select your branch

### 2. Workflow Runs But Doesn't Push Changes

**Symptoms:**
- The workflow runs successfully but doesn't update the manifest.json file
- You see no new commits from GitHub Actions

**Solutions:**
- **Permission Issue (Most Common)**: GitHub has tightened security on workflow tokens
  1. Go to your repository Settings → Actions → General
  2. Scroll down to "Workflow permissions"
  3. Select "Read and write permissions"
  4. Save the changes
- Alternatively, add explicit permissions to the workflow file:
  ```yaml
  jobs:
    generate-manifest:
      runs-on: ubuntu-latest
      permissions:
        contents: write
      # rest of job configuration...
  ```
- If using a personal access token, ensure it has the `repo` scope

### 3. Workflow Fails with Authentication Errors

**Symptoms:**
- Workflow fails with errors like "Authentication failed" or "Permission denied"
- Error in the push step of the workflow

**Solutions:**
- Check the error message in the workflow run logs
- Ensure the `GITHUB_TOKEN` has the correct permissions (see solution 2)
- If using a custom token, verify it's correctly configured in repository secrets
- For detailed error information, add this to your workflow file before the push command:
  ```yaml
  - name: Debug
    run: |
      echo "Actor: ${{ github.actor }}"
      echo "Repository: ${{ github.repository }}"
      echo "Ref: ${{ github.ref }}"
  ```

### 4. Manifest Updates But Website Doesn't Show Changes

**Symptoms:**
- The manifest.json file is updated in the repository
- The website still shows old/removed simulations or doesn't show new ones

**Solutions:**
- This is likely a browser caching issue
- Use the "Refresh Simulations" button on the website
- Try accessing the site through the index-redirect.html page
- Clear your browser cache manually:
  - Windows/Linux: Ctrl+F5
  - Mac: Cmd+Shift+R
- The site includes multiple cache-busting mechanisms that should resolve this issue automatically

## Verifying the Workflow Configuration

The current workflow configuration includes:

1. **Explicit Permissions**: The workflow has `contents: write` permission to allow pushing changes
2. **Manual Trigger Option**: You can manually trigger the workflow using the "workflow_dispatch" event
3. **Automatic Trigger**: The workflow runs automatically on pushes to the main branch

To verify your workflow configuration is correct, compare it with this example:

```yaml
name: Generate Simulations Manifest

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Allow manual triggering

jobs:
  generate-manifest:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Generate manifest.json
        run: |
          # Run the existing generateManifest.js script
          node generateManifest.js

      - name: Commit and push if changed
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add simulations/manifest.json
          git diff --quiet && git diff --staged --quiet || (git commit -m "Update simulations manifest" && git push https://${{ github.actor }}:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git HEAD:${{ github.ref }})
```

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Troubleshooting GitHub Actions](https://docs.github.com/en/actions/troubleshooting)