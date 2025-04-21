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

// Mock Environment Data
export const mockEnvironments: Environment[] = [
  {
    name: 'production',
    description: 'Production environment'
  },
  {
    name: 'staging',
    description: 'Staging environment for testing'
  },
  {
    name: 'development',
    description: 'Development environment'
  }
];

// Mock API Key Data
export const mockApiKeys: Record<string, ApiKey[]> = {
  production: [
    {
      key: '550e8400-e29b-41d4-a716-446655440000',
      envName: 'production',
      active: true
    },
    {
      key: '550e8400-e29b-41d4-a716-446655440001',
      envName: 'production',
      active: false
    }
  ],
  staging: [
    {
      key: '550e8400-e29b-41d4-a716-446655440002',
      envName: 'staging',
      active: true
    }
  ],
  development: [
    {
      key: '550e8400-e29b-41d4-a716-446655440003',
      envName: 'development',
      active: true
    }
  ]
};

// Mock Feature Flag Data
export const mockFeatureFlags: Record<string, FeatureFlag[]> = {
  production: [
    {
      envName: 'production',
      type: 'SIMPLE',
      featureName: 'dark-mode',
      config: '{"enabled":true}'
    },
    {
      envName: 'production',
      type: 'STRING',
      featureName: 'welcome-message',
      config: '{"value":"Welcome to our application!"}'
    }
  ],
  staging: [
    {
      envName: 'staging',
      type: 'PERCENTAGE',
      featureName: 'dark-mode',
      config: '{"enabled":true,"rolloutPercentage":100}'
    },
    {
      envName: 'staging',
      type: 'STRING',
      featureName: 'welcome-message',
      config: '{"value":"Welcome to our staging environment!"}'
    },
    {
      envName: 'staging',
      type: 'PERCENTAGE',
      featureName: 'new-feature',
      config: '{"enabled":true,"rolloutPercentage":50}'
    }
  ],
  development: [
    {
      envName: 'development',
      type: 'SIMPLE',
      featureName: 'dark-mode',
      config: '{"enabled":true}'
    },
    {
      envName: 'development',
      type: 'STRING',
      featureName: 'welcome-message',
      config: '{"value":"Welcome to our development environment!"}'
    },
    {
      envName: 'development',
      type: 'SIMPLE',
      featureName: 'new-feature',
      config: '{"enabled":true}'
    },
    {
      envName: 'development',
      type: 'PERCENTAGE',
      featureName: 'experimental-feature',
      config: '{"enabled":true,"rolloutPercentage":25}'
    }
  ]
};
