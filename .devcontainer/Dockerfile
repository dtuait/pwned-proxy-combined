FROM python:3.13-bullseye

# Install Node.js 22
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create Python virtual environment for the backend
RUN python -m venv /usr/venv/backend

# Ensure the virtual environment's binaries are first in PATH
ENV PATH="/usr/venv/backend/bin:$PATH"

# Set default workdir
WORKDIR /usr/src/project
