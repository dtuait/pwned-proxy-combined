FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create application user
RUN useradd -m appuser && echo 'appuser ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/appuser

# Set workdir
WORKDIR /usr/src/project

# Install Python dependencies into a virtual environment
COPY requirements.txt ./
RUN python -m venv /usr/src/venvs/app-main \
    && /usr/src/venvs/app-main/bin/pip install --no-cache-dir --upgrade pip \
    && /usr/src/venvs/app-main/bin/pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

# Collect static files
WORKDIR /usr/src/project/app-main
RUN /usr/src/venvs/app-main/bin/python manage.py collectstatic --noinput

# Ensure correct ownership
RUN chown -R appuser:appuser /usr/src/project /usr/src/venvs

USER appuser
ENV PATH="/usr/src/venvs/app-main/bin:$PATH"
EXPOSE 8000

ENTRYPOINT ["/usr/src/project/entrypoint.sh"]
