import { buildApiUrl } from './api-config';
import { getServerSession } from 'next-auth';
import { API_CONFIG } from './api-config';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface BreachData {
  Name: string;
}

export interface StealerLogData {
  email?: string;
  domain?: string;
  password?: string;
  source?: string;
}

class ApiClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    
  }

  private async makeGetRequest<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    // Build the URL with query-params if needed
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) =>
        url.searchParams.append(k, v)
      );
    }

    console.log('Making request to:', url.toString());
    console.log('API Key present:', !!this.apiKey);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        // Your proxy auth
        'X-API-Key': this.apiKey
      }
    });

    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }



  // For breached account: sends email in body + HIBP key in body + user token in header
    async getBreachedAccount(email: string): Promise<BreachData[]> {
    // The endpoint for "breached-account" is /breached-account/<email>
    return this.makeGetRequest<BreachData[]>(
      `/breached-account/${encodeURIComponent(email)}`
    );
  }

  async getStealerLogsByEmail(email: string): Promise<StealerLogData[]> {
    return this.makeGetRequest<StealerLogData[]>(
      `/stealer-logs-email/?email=${encodeURIComponent(email)}`
    );
  }

  async getAllBreaches(): Promise<BreachData[]> {
    return this.makeGetRequest<BreachData[]>('/all-breaches');
  }
}
export default ApiClient;