# Pwned Proxy Combined

This repository contains both the Django backend (`pwned-proxy-backend`) and the Next.js frontend (`pwned-proxy-frontend`).
A docker compose file is provided to simplify running the entire stack.

## Requirements

* Debian 12 with [Docker](https://www.docker.com/) and Docker Compose installed.
* Two environment files:
  * `pwned-proxy-backend/.env`
  * `pwned-proxy-frontend/app-main/.env.local`

## Preparing the environment

1. Install Docker and Docker Compose:

   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose -y
   ```

2. Clone this repository on your server.

3. Create the backend environment file. A helper script fills in reasonable defaults from `.env.example` and `.devcontainer/.env.example`:

   ```bash
   cd pwned-proxy-backend
   ./generate_env.sh
   ```

   Edit the generated `.env` and set strong values for at least `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD`.
   You may also supply a value for `HIBP_API_KEY` and other optional settings.

4. Create the frontend environment file by copying the example:

   ```bash
   cd ../pwned-proxy-frontend/app-main
   cp .env.local.example .env.local
   ```

   Adjust `NEXT_PUBLIC_HIBP_PROXY_URL` if the backend is exposed on a different host or port. Additional optional
   variables such as `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_CONTACT_EMAIL` may be set as required.

Return to the repository root once the environment files have been prepared.

## Running the stack

From the repository root execute:

```bash
docker compose up --build -d
```

The services started are:

- **backend** – Django application available on port **8000**
- **frontend** – Next.js frontend served on port **3000**
- **db** – PostgreSQL instance used by the backend

The containers can be stopped with:

```bash
docker compose down
```

## First time setup

When the backend container starts for the first time it will apply migrations, create a superuser and, if `HIBP_API_KEY`
was provided, import initial data. The credentials are printed in the backend logs.

You can access the frontend at [http://localhost:3000](http://localhost:3000) and the Django admin interface at
[http://localhost:8000/admin/](http://localhost:8000/admin/).

## Example setup

The following walkthrough demonstrates a complete installation using Docker. It
assumes `haveibeenpwned.cert.dk` and `api.haveibeenpwned.cert.dk` are proxied to
`localhost:3000` and `localhost:8000` respectively.

### 1. Clone the repository

```bash
git clone https://github.com/dtuait/pwned-proxy-combined
```

### 2. Prepare backend environment

Generate the `.env` files by running `generate_env.sh` inside the backend
directory. This creates `.env` and `.devcontainer/.env` with random values:

```bash
cd pwned-proxy-backend && ./generate_env.sh
```

Example output:

```
Created /home/victor-reipur/Projects/pwned-proxy-combined/pwned-proxy-backend/.env
Created /home/victor-reipur/Projects/pwned-proxy-combined/pwned-proxy-backend/.devcontainer/.env
```

You can inspect the generated file to verify the credentials:

```bash
cat pwned-proxy-backend/.env
```

### 3. Configure the frontend

Copy the example configuration and provide your HIBP and optional Google
Analytics keys:

```bash
cd ../pwned-proxy-frontend/app-main
cp .env.local.example .env.local
nano .env.local
```

![Frontend env](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/2-django-add-hibpkey.png)

### 4. Start the stack

Return to the repository root and launch the containers:

```bash
docker compose up --build -d
```

### 5. Configure the API

Open `https://api.haveibeenpwned.cert.dk/admin` and log in with the admin
credentials printed during startup.

![Login](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/1-django-adminlogin.png)

Add your HIBP key and save it:

![Add key](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/2-django-add-hibpkey.png)
![Save key](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/3-django-savehibpkey.png)

Import the domain list:

![Import domains](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/4-django-importdomains.png)

Generate client API keys and download `seeded_api_keys.json`:

![Seed keys](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/5-django-seed-and-download-clienthibpkeys.png)


