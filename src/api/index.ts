/**
 * API module exports
 */

// Export base client and types
export { apiClient } from './client';
export type { ApiResponse, ApiError } from './client';

// Export data types
export type {
  DashboardMetric,
  RecentActivity,
  DashboardData,
  AnalyticsDataPoint,
  AnalyticsData,
  Report,
  ReportsData
} from './mockData';

// Export environment types
export type {
  Environment,
  ApiKey,
  FeatureFlag,
  FeatureFlagRequest,
  GenerateApiKeyRequest
} from './models/environment';

// Export dashboard endpoints
export {
  fetchDashboardMetrics,
  fetchRecentActivity,
  fetchDashboardData
} from './endpoints/dashboard';

// Export analytics endpoints
export {
  fetchAnalyticsData,
  fetchUserAnalytics,
  fetchRevenueAnalytics
} from './endpoints/analytics';

// Export reports endpoints
export {
  fetchReports,
  fetchReportById,
  fetchReportsByType
} from './endpoints/reports';

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
