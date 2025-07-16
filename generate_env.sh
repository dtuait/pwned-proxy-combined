#!/bin/sh
# Generate environment files for frontend and backend.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"

# Generate backend .env
"$DIR/pwned-proxy-backend/generate_env.sh"

# Copy frontend example
cp "$DIR/pwned-proxy-frontend/app-main/.env.local.example" \
   "$DIR/pwned-proxy-frontend/app-main/.env.local"

echo "Environment files created"
