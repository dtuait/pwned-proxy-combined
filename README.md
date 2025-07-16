# Pwned Proxy Combined

## Purpose of the Tool

Pwned Proxy replicates the official HIBP API endpoint signature. Customers only
need to change the domain and HIBP key to use this service. It acts as a proxy
that allows multiple universities to access their HIBP data exactly as if they
had their own HaveIBeenPwned subscription, providing the same service for free.

## How to Get Started

### First time setup

When the backend container starts for the first time it will apply migrations, create a superuser and, if `HIBP_API_KEY`
was provided, import initial data. On subsequent starts the value of `HIBP_API_KEY` in `pwned-proxy-backend/.env` is
used to update the stored key automatically. The credentials are printed in the backend logs.

You can access the frontend at [http://localhost:3000](http://localhost:3000) and the Django admin interface at
[http://localhost:8000/admin/](http://localhost:8000/admin/).

### Example setup

The following walkthrough demonstrates a complete installation using Docker. It
assumes `domainthatyouown.com` and `api.domainthatyouown.com` are proxied to
`localhost:3000` and `localhost:8000` respectively.

### 1. Clone the repository

```bash
git clone https://github.com/dtuait/pwned-proxy-combined
```

### 2. Backend environment


Run the provided `generate_env.sh` script to create the required environment
files for both the backend and frontend. Random secrets are generated
automatically so you only need to supply your domains and HIBP key afterwards:

```bash
./generate_env.sh
```


### 3. Configure the frontend

The script copies `pwned-proxy-frontend/app-main/.env.local.example` to
`pwned-proxy-frontend/app-main/.env.local` and generates a new
`pwned-proxy-backend/.env`. Edit the generated files to set
`HIBP_API_KEY` and your domain names.

### 4. Start the stack

Return to the repository root and launch the containers:

```bash
docker compose up --build -d
```

### 5. Configure the API

Open `https://api.domainthatyouown.com/admin` or `localhost:8000/admin` and log in with the admin
credentials printed during startup.

![Login](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/1-django-adminlogin.png)

Add your HIBP key and save it:

![Add key](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/2-django-add-hibpkey.png)
![Save key](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/3-django-savehibpkey.png)

Import the domain list:

![Import domains](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/4.1-django-importdomains.png)

Generate client API keys and download `seeded_api_keys.json`:

![Seed keys](https://supabase.vicre-nextjs-01.security.ait.dtu.dk/storage/v1/object/public/hibp-guide/5.2-django-seed-and-download-clienthibpkeys.png)


### 6. Start production

Run the stack in production mode by first generating the environment files and
then building the images:

```bash
./generate_env.sh
docker compose build && docker compose up -d
```


