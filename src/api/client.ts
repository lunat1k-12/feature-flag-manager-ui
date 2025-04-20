/**
 * Base API client for making requests to the API
 */

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
  private mockMode: boolean;

  constructor(baseUrl: string = API_BASE_URL, mockMode: boolean = false) {
    this.baseUrl = baseUrl;
    this.mockMode = mockMode;
  }

  /**
   * Makes a GET request to the API
   * @param endpoint The API endpoint
   * @param shouldFail Whether the request should fail (for testing error handling)
   * @param delayMs Custom delay in milliseconds
   */
  async get<T>(endpoint: string, shouldFail: boolean = false, delayMs: number = DEFAULT_DELAY): Promise<ApiResponse<T>> {
    if (this.mockMode) {
      // Simulate network delay in mock mode
      await delay(delayMs);

      if (shouldFail) {
        throw new ApiError(`Failed to fetch data from ${endpoint}`, 500);
      }

      // Return a success response for mock mode
      return {
        data: {} as T, // This will be overridden by specific endpoint handlers
        success: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);

      if (!response.ok) {
        console.log(JSON.stringify(response));
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
   * Makes a POST request to the API
   * @param endpoint The API endpoint
   * @param data The data to send
   * @param shouldFail Whether the request should fail (for testing error handling)
   * @param delayMs Custom delay in milliseconds
   */
  async post<T, R>(endpoint: string, data: T, shouldFail: boolean = false, delayMs: number = DEFAULT_DELAY): Promise<ApiResponse<R>> {
    if (this.mockMode) {
      // Simulate network delay in mock mode
      await delay(delayMs);

      if (shouldFail) {
        throw new ApiError(`Failed to post data to ${endpoint}`, 500);
      }

      // Return a success response for mock mode
      return {
        data: {} as R, // This will be overridden by specific endpoint handlers
        success: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
