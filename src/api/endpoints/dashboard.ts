/**
 * Dashboard API endpoints
 */

import { apiClient, ApiResponse } from '../client';
import { 
  DashboardData, 
  DashboardMetric, 
  RecentActivity, 
  mockDashboardData 
} from '../mockData';

/**
 * Fetches dashboard metrics
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchDashboardMetrics(shouldFail: boolean = false): Promise<ApiResponse<DashboardMetric[]>> {
  try {
    const response = await apiClient.get<DashboardMetric[]>('/dashboard/metrics', shouldFail);
    // Override the empty data with our mock data
    response.data = mockDashboardData.metrics;
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches recent activity
 * @param limit Number of activity items to return
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchRecentActivity(limit: number = 5, shouldFail: boolean = false): Promise<ApiResponse<RecentActivity[]>> {
  try {
    const response = await apiClient.get<RecentActivity[]>('/dashboard/activity', shouldFail);
    // Override the empty data with our mock data, respecting the limit
    response.data = mockDashboardData.recentActivity.slice(0, limit);
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches all dashboard data
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchDashboardData(shouldFail: boolean = false): Promise<ApiResponse<DashboardData>> {
  try {
    const response = await apiClient.get<DashboardData>('/dashboard', shouldFail);
    // Override the empty data with our mock data
    response.data = mockDashboardData;
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}
