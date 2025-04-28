/**
 * Environment API endpoints
 */

import { apiClient, ApiResponse } from '../client';
import { 
  Environment, 
  ApiKey, 
  FeatureFlag, 
  FeatureFlagRequest, 
  GenerateApiKeyRequest
} from '../models/environment';

/**
 * Fetches all environments
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchEnvironments(shouldFail: boolean = false): Promise<ApiResponse<Environment[]>> {
  try {
    const response = await apiClient.get<Environment[]>('/env', shouldFail, 0);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Creates a new environment
 * @param environment The environment to create
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function createEnvironment(environment: Environment, shouldFail: boolean = false): Promise<ApiResponse<Environment>> {
  try {
    const response = await apiClient.post<Environment, Environment>('/env', environment, shouldFail);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches feature flags for a specific environment
 * @param envName The name of the environment
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchFeatureFlags(envName: string, shouldFail: boolean = false): Promise<ApiResponse<FeatureFlag[]>> {
  try {
    const response = await apiClient.get<FeatureFlag[]>(`/env/ff?envName=${envName}`, shouldFail, 0);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Creates a new feature flag
 * @param featureFlag The feature flag to create
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function createFeatureFlag(featureFlag: FeatureFlagRequest, shouldFail: boolean = false): Promise<ApiResponse<FeatureFlag>> {
  try {
    const response = await apiClient.post<FeatureFlagRequest, FeatureFlag>('/env/ff', featureFlag, shouldFail);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches API keys for a specific environment
 * @param envName The name of the environment
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchApiKeys(envName: string, shouldFail: boolean = false): Promise<ApiResponse<ApiKey[]>> {
  try {
    const response = await apiClient.get<ApiKey[]>(`/env/key/${envName}`, shouldFail);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Generates a new API key for an environment
 * @param request The request containing the environment name
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function generateApiKey(request: GenerateApiKeyRequest, shouldFail: boolean = false): Promise<ApiResponse<ApiKey>> {
  try {
    const response = await apiClient.post<GenerateApiKeyRequest, ApiKey>('/env/key', request, shouldFail);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Deletes an API key
 * @param envName The name of the environment
 * @param key The API key to delete
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function deleteApiKey(envName: string, key: string, shouldFail: boolean = false): Promise<ApiResponse<void>> {
  try {
    const response = await apiClient.get<void>(`/env/key/${envName}/${key}`, shouldFail);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Deletes a feature flag
 * @param envName The name of the environment
 * @param featureName The name of the feature flag to delete
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function deleteFeatureFlag(envName: string, featureName: string, shouldFail: boolean = false): Promise<ApiResponse<void>> {
  try {
    const response = await apiClient.delete<void>(`/env/ff/${envName}/${featureName}`, shouldFail);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}
