#!/bin/bash

# Script to update all HTML files in the mock directory to include the scripts.js file

MOCK_DIR="/Users/sixtyoneeighty/Documents/GitHub/Jobs_Applier_AI_Agent_AIHawk/web_ui/frontend/public/mock"

# Loop through all HTML files in the directory
for file in "$MOCK_DIR"/*.html; do
  echo "Processing $file..."
  
  # Check if file already has scripts.js
  if grep -q "scripts.js" "$file"; then
    echo "  - scripts.js already included. Skipping."
  else
    # Add scripts.js reference before closing body tag
    sed -i '' 's/<\/body>/  <script src="scripts.js"><\/script>\n<\/body>/g' "$file"
    echo "  - Added scripts.js reference."
  fi
done

echo "All HTML files updated successfully!"
