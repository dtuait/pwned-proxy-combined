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

The repository ships with a pre-generated `pwned-proxy-backend/.env` so you can
run the stack right away. If you prefer unique credentials you can regenerate
this file at any time:



```bash
cd pwned-proxy-backend && ./generate_env.sh
```


### 3. Configure the frontend

`pwned-proxy-frontend/app-main/.env.local` is also included. Adjust the values if
you want to connect to a different backend or supply analytics keys:

```bash
cd ../pwned-proxy-frontend/app-main
nano .env.local
NEXT_PUBLIC_HIBP_PROXY_URL=http://api.domainthatyouown.com/
NEXT_PUBLIC_GA_MEASUREMENT_ID=<google_analytics_measurement_id> # add if you analytics
HIBP_API_KEY=<REQUIRED>
NEXT_PUBLIC_CONTACT_EMAIL=person@email.com

```

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

Run the stack in production mode with the following commands executed from the
repository root:

```bash
docker compose build
docker compose up -d
```

You can achieve the same result in a single line:

```bash
docker compose build && docker compose up -d
```


