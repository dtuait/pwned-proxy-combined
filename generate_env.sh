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

# Prompt for HIBP key and domain
printf "Enter your HIBP API key (leave blank to skip): "
read -r hibp_key
printf "Enter domain for the API [localhost:8000]: "
read -r domain
domain=${domain:-localhost:8000}

# Update backend environment values
backend_env="$DIR/pwned-proxy-backend/.env"
sed -i "s/^HIBP_API_KEY=.*/HIBP_API_KEY=$hibp_key/" "$backend_env"
sed -i "s#^SERVICE_FQDN_APP=.*#SERVICE_FQDN_APP=$domain#" "$backend_env"
sed -i "s#^PWNED_PROXY_DOMAIN=.*#PWNED_PROXY_DOMAIN=$domain#" "$backend_env"

# Update frontend environment values
frontend_env="$DIR/pwned-proxy-frontend/app-main/.env.local"
sed -i "s#^NEXT_PUBLIC_HIBP_PROXY_URL=.*#NEXT_PUBLIC_HIBP_PROXY_URL=http://$domain/#" "$frontend_env"

echo "Environment files created."
