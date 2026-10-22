#!/usr/bin/env bash
set -e
REPO_NAME="${1:-safecity}"
echo "Initializing Git repository for $REPO_NAME..."
git init
git checkout -B main
git add .
git commit -m "Initial commit: SafeCity Smart Community Safety & Emergency Navigation Platform"
if command -v gh >/dev/null 2>&1; then
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
  echo "Pushed to GitHub! Enable GitHub Pages under Settings -> Pages -> Source: GitHub Actions."
else
  echo "Git repository ready. Run: git remote add origin https://github.com/<your-username>/$REPO_NAME.git && git push -u origin main"
fi
