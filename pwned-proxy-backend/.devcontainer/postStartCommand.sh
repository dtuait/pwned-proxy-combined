#!/bin/bash
echo "Running postStartCommand.sh..."

curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
        | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
        && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
        | sudo tee /etc/apt/sources.list.d/ngrok.list \
        && sudo apt update \
        && sudo apt install ngrok

# Ensure Python dependencies are installed inside the container
/usr/src/venvs/app-main/bin/pip install --no-cache-dir -r /usr/src/project/.devcontainer/requirements.txt

# if /usr/src/project/app-main/.env.local and NGROK_AUTHTOKEN from /usr/src/project/app-main/.env.local exists then run
ENV_FILE="/usr/src/project/.devcontainer/.env"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE="/usr/src/project/.env"
fi

if [ -f "$ENV_FILE" ]; then
  DEVCONTAINER_NGROK_AUTHTOKEN=$(grep -oP '^DEVCONTAINER_NGROK_AUTHTOKEN=\K.*' "$ENV_FILE")
  if [ -n "$DEVCONTAINER_NGROK_AUTHTOKEN" ]; then
    ngrok config add-authtoken "$DEVCONTAINER_NGROK_AUTHTOKEN"
  else
    echo "DEVCONTAINER_NGROK_AUTHTOKEN not found in $ENV_FILE"
  fi
else
  echo "No env file found"
fi

ngrok http --url=api.dtuaitsoc.ngrok.dev 3000
