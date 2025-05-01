/**
 * API module exports
 */

// Export base client and types
export { apiClient } from './client';
export { authApiClient } from './authClient';
export type { ApiResponse, ApiError } from './client';

// Export environment types
export type {
  Environment,
  ApiKey,
  FeatureFlag,
  FeatureFlagRequest,
  GenerateApiKeyRequest
} from './models/environment';


// Export environment endpoints
export {
  fetchEnvironments,
  createEnvironment,
  fetchFeatureFlags,
  createFeatureFlag,
  fetchApiKeys,
  generateApiKey,
  deleteApiKey,
  deleteFeatureFlag
} from './endpoints/environment';
