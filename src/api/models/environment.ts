/**
 * Environment and Feature Flag models based on the Swagger API
 */

// Environment Types
export interface Environment {
  name: string;
  description: string;
}

// API Key Types
export interface ApiKey {
  key: string;
  envName: string;
  active: boolean;
}

export interface GenerateApiKeyRequest {
  env: string;
}

// Feature Flag Types
export interface FeatureFlag {
  envName: string;
  type: string;
  featureName: string;
  config: string;
}

export interface FeatureFlagRequest {
  envName: string;
  type: string;
  featureName: string;
  config?: string;
}
