/**
 * Enhanced API client that includes authentication
 */

import { ApiClient, ApiResponse } from './client';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8080';

/**
 * API client that includes authentication headers
 */
export class AuthApiClient extends ApiClient {
  /**
   * Makes a GET request with authentication
   * @param endpoint The API endpoint
   * @param shouldFail Whether the request should fail (for testing)
   * @param delayMs Custom delay in milliseconds
   */
  async get<T>(endpoint: string, shouldFail: boolean = false, delayMs?: number): Promise<ApiResponse<T>> {
    return this.makeAuthenticatedRequest(() => super.get<T>(endpoint, shouldFail, delayMs));
  }

  /**
   * Makes a POST request with authentication
   * @param endpoint The API endpoint
   * @param data The data to send
   * @param shouldFail Whether the request should fail (for testing)
   * @param delayMs Custom delay in milliseconds
   */
  async post<T, R>(endpoint: string, data: T, shouldFail: boolean = false, delayMs?: number): Promise<ApiResponse<R>> {
    return this.makeAuthenticatedRequest(() => super.post<T, R>(endpoint, data, shouldFail, delayMs));
  }

  /**
   * Makes a DELETE request with authentication
   * @param endpoint The API endpoint
   * @param shouldFail Whether the request should fail (for testing)
   * @param delayMs Custom delay in milliseconds
   */
  async delete<T>(endpoint: string, shouldFail: boolean = false, delayMs?: number): Promise<ApiResponse<T>> {
    return this.makeAuthenticatedRequest(() => super.delete<T>(endpoint, shouldFail, delayMs));
  }

  /**
   * Wraps a request with authentication
   * @param requestFn The request function to wrap
   */
  private async makeAuthenticatedRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    // Add authentication headers to fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      // Get the auth token from localStorage
      const token = localStorage.getItem('auth_token');
      
      // If we have a token, add it to the headers
      if (token) {
        init = init || {};
        init.headers = {
          ...init.headers,
          'Authorization': `Bearer ${token}`
        };
      }
      
      return originalFetch(input, init);
    };

    try {
      // Make the request
      return await requestFn();
    } finally {
      // Restore the original fetch
      window.fetch = originalFetch;
    }
  }
}

// Export a singleton instance of the authenticated API client
export const authApiClient = new AuthApiClient(API_BASE_URL);