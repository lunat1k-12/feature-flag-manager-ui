import { apiClient, ApiResponse } from '../client';

// Metrics data types
export interface MetricDataPoint {
  value: number;
  label: string;
}

export interface FeatureMetrics {
  featureName: string;
  enabledAxis: MetricDataPoint[];
  disabledAxis: MetricDataPoint[];
}

/**
 * Fetch metrics data for a specific environment and time period
 * @param env Environment name
 * @param type Time period type ('day' or 'week')
 */
export async function fetchMetrics(env: string, type: 'day' | 'week'): Promise<ApiResponse<FeatureMetrics[]>> {
  try {
    const response = await apiClient.get<FeatureMetrics[]>(`/env/metric/${env}/${type}`);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}
