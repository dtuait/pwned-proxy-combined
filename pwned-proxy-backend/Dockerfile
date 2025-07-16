FROM python:3.11-slim

# Install build dependencies and sudo
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential sudo && rm -rf /var/lib/apt/lists/*

# Create application user with passwordless sudo
RUN useradd --create-home --shell /bin/bash appuser && echo "appuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/appuser

# Create virtual environment for the app
RUN python -m venv /usr/src/venvs/app-main
ENV PATH="/usr/src/venvs/app-main/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /usr/src/project

COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chown -R appuser:appuser /usr/src/project

USER appuser

EXPOSE 8000
ENTRYPOINT ["/usr/src/project/entrypoint.sh"]
