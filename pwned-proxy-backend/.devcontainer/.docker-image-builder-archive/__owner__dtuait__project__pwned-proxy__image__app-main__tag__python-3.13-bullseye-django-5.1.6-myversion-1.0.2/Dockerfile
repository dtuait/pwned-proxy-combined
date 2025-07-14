# Use latest stable Python 3.13.2
FROM python:3.13.2-bookworm

ARG CURRENT_UID=1000
ARG CURRENT_GID=1000

# Create a non-root 'appuser' with matching UID/GID
RUN if [ "$CURRENT_UID" = "0" ] || [ "$CURRENT_GID" = "0" ]; then \
      groupadd -g 1000 appuser && useradd -u 1000 -g 1000 -m appuser; \
    else \
      groupadd -g $CURRENT_GID appuser && useradd -u $CURRENT_UID -g $CURRENT_GID -m appuser; \
    fi

# Install OS dependencies so psycopg can be built
RUN apt-get update \
    && apt-get install -y sudo locales build-essential libpq-dev gettext tree \
    && sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen \
    && dpkg-reconfigure --frontend=noninteractive locales \
    && update-locale LC_ALL=en_US.UTF-8 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install ngrok
RUN curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
    && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list \
    && sudo apt update \
    && sudo apt install -y ngrok


RUN echo "appuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/appuser
RUN usermod --shell /bin/bash appuser

ENV LC_ALL=en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8

# Create a virtual environment for Python
RUN mkdir -p /usr/src/venvs \
    && python -m venv /usr/src/venvs/app-main

# Copy requirements and install into the virtual environment
COPY ./requirements.txt /usr/src/
RUN /usr/src/venvs/app-main/bin/pip install --upgrade pip \
    && /usr/src/venvs/app-main/bin/pip install --no-cache-dir -r /usr/src/requirements.txt

# Fix permissions on the virtual environment
RUN chown -R appuser:appuser /usr/src/venvs

# Switch to non-root user
USER appuser
WORKDIR /usr/src/project

# Default command (you can override this with docker-compose or at runtime)
CMD ["/bin/bash"]
