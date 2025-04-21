# Setting Up the Pre-commit Git Hook

To automatically update the `simulations.json` file whenever you make a commit, you need to set up a pre-commit Git hook.

## Instructions

1. Create a file named `pre-commit` (no file extension) in your `.git/hooks` directory with the following content:

```bash
#!/bin/sh
node generate-simulations.js
git add simulations.json
```

2. Make the file executable (on Linux/Mac):

```bash
chmod +x .git/hooks/pre-commit
```

On Windows, you can skip this step as the execute permission is not required.

## What This Does

This hook will:
1. Run the `generate-simulations.js` script before each commit
2. Add the updated `simulations.json` file to the commit

This ensures that your `simulations.json` file is always up-to-date with the latest simulations in your repository.

## Manual Execution

If you prefer to update the `simulations.json` file manually, you can run:

```bash
node generate-simulations.js
```

Then commit the changes as usual.

## Dependencies

Make sure you have installed the required dependencies:

```bash
npm install jsdom
```