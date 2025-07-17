#!/bin/bash
set -e

echo "Running postStartCommand.sh..."


# Ensure Python virtual environment exists
if [ ! -d /usr/venv/backend ]; then
    python -m venv /usr/venv/backend
fi

# Install backend Python dependencies inside the virtual environment
/usr/venv/backend/bin/pip install --no-cache-dir -r pwned-proxy-backend/requirements.txt


# Install frontend Node dependencies
pushd pwned-proxy-frontend/app-main >/dev/null
npm install
popd >/dev/null

# Generate backend env files if missing
if [ ! -f pwned-proxy-backend/.env ]; then
    (cd pwned-proxy-backend && ./generate_env.sh)
fi

# Export backend environment variables so helper scripts can access them
set -a
source pwned-proxy-backend/.env
# Use static credentials for the dev database
POSTGRES_HOST=dev-db
POSTGRES_DB=dev-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
set +a

# Apply migrations and create the default admin user
/usr/venv/backend/bin/python pwned-proxy-backend/app-main/wait_for_db.py
/usr/venv/backend/bin/python pwned-proxy-backend/manage.py migrate --noinput
/usr/venv/backend/bin/python pwned-proxy-backend/app-main/create_admin.py

# Copy frontend env if missing
if [ ! -f pwned-proxy-frontend/app-main/.env.local ]; then
    cp pwned-proxy-frontend/app-main/.env.local.example pwned-proxy-frontend/app-main/.env.local
fi

# Configure ngrok when token provided
if [ -n "${DEVCONTAINER_NGROK_AUTHTOKEN}" ]; then
    curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc |
        tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
    echo "deb https://ngrok-agent.s3.amazonaws.com buster main" |
        tee /etc/apt/sources.list.d/ngrok.list
    apt-get update && apt-get install -y ngrok
    ngrok config add-authtoken "$DEVCONTAINER_NGROK_AUTHTOKEN"
fi
