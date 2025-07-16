# pwned-proxy-frontend

## Configuration

Copy `.env.local.example` to `.env.local` and adjust `NEXT_PUBLIC_HIBP_PROXY_URL`
if you wish to use a different API location. By default it points to
`http://localhost:8000/`. This variable is read by the
start page and the header link so it also works when deployed with Coolify.

### Google Analytics

If you want to track visits with Google Analytics you can provide your
measurement id through an environment variable. Add the variable
`NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Next.js exposes variables prefixed with `NEXT_PUBLIC_` to the browser during
runtime. When this variable is defined the application will automatically load
the GA script and start sending page view events. Remember to rebuild the app
after changing environment variables.

### Contact Email

Set `NEXT_PUBLIC_CONTACT_EMAIL` in `.env.local` to display a contact address on the About page:

```bash
NEXT_PUBLIC_CONTACT_EMAIL=cert@cert.dk
```
