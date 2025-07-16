#!/bin/sh
# Generate environment files for frontend and backend.
# Random secrets are generated automatically. After running this
# script edit the created files to set your domain names and HIBP key.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

# Generate backend .env
"$DIR/pwned-proxy-backend/generate_env.sh"

# Copy frontend example
cp "$DIR/pwned-proxy-frontend/app-main/.env.local.example" \
   "$DIR/pwned-proxy-frontend/app-main/.env.local"

echo "Environment files created. Please edit .env and .env.local to add your" \
     "HIBP key and domains."
