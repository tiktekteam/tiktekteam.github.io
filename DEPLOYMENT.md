# Deploying to GitHub Pages

Follow these steps to deploy this Math Simulations Gallery to your GitHub Pages root domain:

## Deployment Steps

### 1. Create a Special Repository

Create a new repository specifically named `tiktekteam.github.io` (where "tiktekteam" is your actual GitHub username).

### 2. Push to GitHub

```bash
# Initialize git repository if not already done
git init

# Add all files
git add .

# Commit the changes
git commit -m "Initial commit with Math Simulations Gallery"

# Add your GitHub repository as remote
git remote add origin https://github.com/tiktekteam/tiktekteam.github.io.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"

### 4. Access Your Site

Your site will be available directly at: `https://tiktekteam.github.io/`

## 5. Verify GitHub Actions

1. Go to the "Actions" tab in your repository
2. Verify that the "Generate Simulations Manifest" workflow has run successfully
3. If it hasn't run automatically, you can manually trigger it by clicking on "Run workflow"

For detailed instructions on enabling and troubleshooting GitHub Actions, see [SOLUTION_GITHUB_ACTIONS.md](SOLUTION_GITHUB_ACTIONS.md).

## Troubleshooting

If your site doesn't appear or the manifest isn't being generated:

1. Check that your repository is public (GitHub Pages requires this for free accounts)
2. Verify that the GitHub Actions workflow has the necessary permissions
3. Make sure your branch name matches what's specified in the workflow file (main)
4. Check the Actions tab for any error messages

## Adding Custom Domain (Optional)

If you want to use a custom domain:

1. Go to repository Settings > Pages
2. Under "Custom domain", enter your domain name
3. Update DNS settings with your domain provider
4. Add a CNAME file to your repository root with your domain name
