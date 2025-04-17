# Changing GitHub Authentication from nisimcode to tiktekteam

## Issue
You are currently logged in to GitHub as "nisimcode" in your terminal, but you want to deploy the project as "tiktekteam".

## Solution

There are several ways to address this issue:

### Option 1: Update Git Credentials in Windows Credential Manager

1. Open the Windows Credential Manager:
   - Press the Windows key and search for "Credential Manager"
   - Or navigate to Control Panel > User Accounts > Credential Manager

2. Click on "Windows Credentials"

3. Look for any GitHub credentials (they will start with "git:" or "github.com")

4. Edit or remove the existing GitHub credentials:
   - To edit: Click on the credential and update the username to "tiktekteam" and enter the appropriate password
   - To remove: Click on the credential and select "Remove", then you'll be prompted to enter new credentials the next time you interact with GitHub

### Option 2: Use GitHub CLI to Login as tiktekteam

If you have GitHub CLI installed:

1. Open a terminal and run:
   ```
   gh auth logout
   gh auth login
   ```

2. Follow the prompts to authenticate as "tiktekteam"

### Option 3: Update Remote URL to Include Credentials

You can update the remote URL to include the tiktekteam credentials:

```
git remote set-url origin https://tiktekteam@github.com/tiktekteam/tiktekteam.github.io.git
```

When you push to this remote, you'll be prompted for the password for the tiktekteam account.

### Option 4: Use a Personal Access Token

1. Log in to GitHub as "tiktekteam"
2. Go to Settings > Developer settings > Personal access tokens
3. Generate a new token with appropriate permissions (repo, workflow)
4. Update your remote URL to use this token:

```
git remote set-url origin https://tiktekteam:<YOUR_TOKEN>@github.com/tiktekteam/tiktekteam.github.io.git
```

Replace `<YOUR_TOKEN>` with the actual token value.

## Verification

After making these changes, you can verify that you're using the correct account by:

1. Making a small change to a file
2. Committing the change
3. Pushing to GitHub
4. Checking the commit on GitHub to ensure it's associated with the "tiktekteam" account

## Note

The project files themselves (README.md, DEPLOYMENT.md, _config.yml) are already correctly configured to use "tiktekteam" as the GitHub username, so no changes to these files are necessary.