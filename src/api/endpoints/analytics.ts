/**
 * Analytics API endpoints
 */

import { apiClient, ApiResponse } from '../client';
import { AnalyticsData, mockAnalyticsData } from '../mockData';

/**
 * Fetches analytics data
 * @param timeRange The time range for the analytics data
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchAnalyticsData(
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  shouldFail: boolean = false
): Promise<ApiResponse<AnalyticsData>> {
  try {
    const response = await apiClient.get<AnalyticsData>(`/analytics?timeRange=${timeRange}`, shouldFail);
    
    // Override the empty data with our mock data
    // In a real implementation, we would filter based on the timeRange
    response.data = {
      ...mockAnalyticsData,
      timeRange
    };
    
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches user analytics data
 * @param timeRange The time range for the analytics data
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchUserAnalytics(
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  shouldFail: boolean = false
): Promise<ApiResponse<{ dataPoints: { date: string; users: number }[] }>> {
  try {
    const response = await apiClient.get<{ dataPoints: { date: string; users: number }[] }>(
      `/analytics/users?timeRange=${timeRange}`,
      shouldFail
    );
    
    // Extract just the user data from our mock data
    response.data = {
      dataPoints: mockAnalyticsData.dataPoints.map(point => ({
        date: point.date,
        users: point.users
      }))
    };
    
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches revenue analytics data
 * @param timeRange The time range for the analytics data
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchRevenueAnalytics(
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  shouldFail: boolean = false
): Promise<ApiResponse<{ dataPoints: { date: string; revenue: number }[] }>> {
  try {
    const response = await apiClient.get<{ dataPoints: { date: string; revenue: number }[] }>(
      `/analytics/revenue?timeRange=${timeRange}`,
      shouldFail
    );
    
    // Extract just the revenue data from our mock data
    response.data = {
      dataPoints: mockAnalyticsData.dataPoints.map(point => ({
        date: point.date,
        revenue: point.revenue
      }))
    };
    
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}
