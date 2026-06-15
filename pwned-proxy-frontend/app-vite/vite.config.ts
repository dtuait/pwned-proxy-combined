import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// process.cwd() and loadEnv are Node-only tools (process doesn't exist in a browser). 
// So this code can only run in Node — which confirms it's the build side, not the browser side.

//  Before, passed an object ({...}). 
//  Now pass a function (() => {...}) that returns the config object. 
// This allows us to read .env files (Node-only) and use those values in the config, 
// like for the proxy target and API key

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // listen on all addresses (port-forwarding works)
//     port: 5173,
//     watch: { usePolling: true }, // make auto-reload work inside Docker
//   },
// });

// ({ mode }) = Vite hands our function the current mode ("development" or "production").
export default defineConfig(({ mode }) => {
  // loadEnv reads .env files and returns an object with the values.
  // The third argument "" means "don't add VITE_ prefix to the keys".
  // Three args: mode (which .env to load), process.cwd() (the current folder, where .env lives), 
  // and "" — the prefix filter. Empty string means "load ALL variables, not just VITE_ ones" — 
  // essential, because our HIBP_PROXY_API_KEY has no VITE_ prefix. 
  // (Safe, because this runs in Node, not the browser.)
  const env = loadEnv(mode, process.cwd(), "");      
  const backendUrl = env.HIBP_PROXY_INTERNAL_URL || "http://localhost:8000";
  const apiKey = env.HIBP_PROXY_API_KEY || "";

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      watch: { usePolling: true },
      proxy: {
        "/api": {                                    // anything starting with /api…
          target: backendUrl,                        // …gets forwarded to the backend
          changeOrigin: true,
          // A hook that runs on every forwarded request: it attaches the X-API-Key header with the key. 
          // This is the whole point — the key is added here, in Node, so the browser never sees it.
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (apiKey) proxyReq.setHeader("X-API-Key", apiKey);  // attaches the key
            });
          },
        },
      },
    },
  };
});