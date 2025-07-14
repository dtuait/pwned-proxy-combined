export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
    'https://preview.api.haveibeenpwned.cert.dk',
  ENDPOINTS: {
    // Endpoints that require email + apikey
    BREACHED_ACCOUNT: '/breached-account',           // GET 5) Breached Account (by email)
    PASTE_ACCOUNT: '/paste-account',                 // GET 8) Paste Account (by email)
    STEALER_LOGS_EMAIL: '/stealer-logs-email',       // GET 10) Stealer Logs by Email
    PWNED_PASSWORDS: '/pwned-passwords',             // GET 12) Pwned Passwords (Range)
    
    // Endpoints that require domain/website + apikey
    BREACHED_DOMAIN_SEARCH: '/breached-domain-search', // GET 3) Breached Domain Search
    STEALER_LOGS_DOMAIN: '/stealer-logs-domain',     // GET 9) Stealer Logs by Email Domain
    STEALER_LOGS_WEBSITE: '/stealer-logs-website',   // GET 11) Stealer Logs by Website Domain
    
    // Endpoints that only need apikey
    SUBSCRIPTION_DOMAINS: '/subscription-domains',   // GET 1) Subscription - Subscribed Domains
    SUBSCRIPTION_STATUS: '/subscription-status',     // GET 2) Subscription - Status
    ALL_BREACHES: '/all-breaches',                   // GET 6) All Breaches (publicly known)
    SINGLE_BREACH: '/single-breach',                 // GET 7) Single Breach by Name
    DATA_CLASSES: '/data-classes'                    // GET 4) Dataclasses (all possible breach dataclasses)
  }
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export type EndpointType = 'email' | 'domain' | 'website' | 'password' | 'breach-name' | 'none';

export interface EndpointConfig {
  endpoint: string;
  inputType: EndpointType;
  requiresInput: boolean;
}

export const ENDPOINT_CONFIGS: Record<string, EndpointConfig> = {
  'breached-account': {
    endpoint: API_CONFIG.ENDPOINTS.BREACHED_ACCOUNT,
    inputType: 'email',
    requiresInput: true
  },
  'stealer-logs-email': {
    endpoint: API_CONFIG.ENDPOINTS.STEALER_LOGS_EMAIL,
    inputType: 'email',
    requiresInput: true
  },
  'paste-account': {
    endpoint: API_CONFIG.ENDPOINTS.PASTE_ACCOUNT,
    inputType: 'email',
    requiresInput: true
  },
  'stealer-logs-domain': {
    endpoint: API_CONFIG.ENDPOINTS.STEALER_LOGS_DOMAIN,
    inputType: 'domain',
    requiresInput: true
  },
  'all-breaches': {
    endpoint: API_CONFIG.ENDPOINTS.ALL_BREACHES,
    inputType: 'none',
    requiresInput: false
  }
};