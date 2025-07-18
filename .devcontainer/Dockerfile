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

# Create non-root user so the workspace is writable when the host
# directory is mounted with root squash. Grant passwordless sudo so
# postStartCommand.sh can install optional tooling.
ARG USERNAME=devuser
ARG USER_UID=1000
ARG USER_GID=1000
RUN apt-get update && apt-get install -y sudo \
    && groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && chown -R $USERNAME:$USERNAME /usr/venv/backend /usr/src/project

# Use the non-root user by default
USER $USERNAME
