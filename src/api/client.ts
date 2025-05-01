/**
 * Base API client for making requests to the API
 */
import {User} from "oidc-client-ts";

// Base URL for the API
const API_BASE_URL = 'http://localhost:8080';

// Configurable delay to simulate network latency (in ms)
// Only used for mock mode
const DEFAULT_DELAY = 800;

// Generic response type for all API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

// Error class for API errors
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

/**
 * Simulates a network delay
 * @param ms Delay in milliseconds
 */
export const delay = (ms: number = DEFAULT_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Base API client class
 */
export class ApiClient {
  private baseUrl: string;
  private user: User | null | undefined;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.user = null;
  }

  // Add a method to set the user
  setUser(user: User | null | undefined): void {
    this.user = user;
  }

  /**
   * Makes a GET request to the API
   * @param endpoint The API endpoint
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {

    try {
      // Get the auth token from localStorage
      // const token = localStorage.getItem('auth_token');

      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token exists
      if (this.user?.id_token) {
        headers['Authorization'] = `Bearer ${this.user.id_token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
      });

      if (!response.ok) {
        throw new ApiError(`Failed to fetch data from ${endpoint}`, response.status);
      }

      const data = await response.json();

      return {
        data: data as T,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to fetch data from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  /**
   * Makes a DELETE request to the API
   * @param endpoint The API endpoint
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token exists
      if (this.user?.id_token) {
        headers['Authorization'] = `Bearer ${this.user.id_token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new ApiError(`Failed to delete data from ${endpoint}`, response.status);
      }

      // For DELETE requests, the response might be empty
      let responseData = {} as T;
      try {
        responseData = await response.json();
      } catch {
        // If the response is empty or not JSON, use an empty object
      }

      return {
        data: responseData as T,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to delete data from ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  /**
   * Makes a POST request to the API
   * @param endpoint The API endpoint
   * @param data The data to send
   */
  async post<T, R>(endpoint: string, data: T): Promise<ApiResponse<R>> {
    try {
      // Prepare headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if token exists
      if (this.user?.id_token) {
        headers['Authorization'] = `Bearer ${this.user.id_token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new ApiError(`Failed to post data to ${endpoint}`, response.status);
      }

      const responseData = await response.json();

      return {
        data: responseData as R,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Failed to post data to ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }
  }

  /**
   * Handles API errors consistently
   * @param error The error to handle
   */
  handleError(error: unknown): ApiResponse<never> {
    if (error instanceof ApiError) {
      console.error(`API Error (${error.statusCode}): ${error.message}`);
      return {
        data: {} as never,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }

    if (error instanceof Error) {
      console.error(`Unexpected Error: ${error.message}`);
      return {
        data: {} as never,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }

    console.error('Unknown error occurred', error);
    return {
      data: {} as never,
      success: false,
      error: 'An unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }
}

// Export a singleton instance of the API client
export const apiClient = new ApiClient();
