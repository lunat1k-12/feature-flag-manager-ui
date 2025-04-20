/**
 * Reports API endpoints
 */

import { apiClient, ApiResponse } from '../client';
import { Report, ReportsData, mockReportsData } from '../mockData';

/**
 * Fetches all reports
 * @param page Page number for pagination
 * @param limit Number of reports per page
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchReports(
  page: number = 1,
  limit: number = 10,
  shouldFail: boolean = false
): Promise<ApiResponse<ReportsData>> {
  try {
    const response = await apiClient.get<ReportsData>(
      `/reports?page=${page}&limit=${limit}`,
      shouldFail
    );
    
    // Override the empty data with our mock data
    // In a real implementation, we would handle pagination here
    response.data = mockReportsData;
    
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches a specific report by ID
 * @param reportId The ID of the report to fetch
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchReportById(
  reportId: string,
  shouldFail: boolean = false
): Promise<ApiResponse<Report>> {
  try {
    const response = await apiClient.get<Report>(`/reports/${reportId}`, shouldFail);
    
    // Find the report in our mock data
    const report = mockReportsData.reports.find(r => r.id === reportId);
    
    if (!report) {
      throw new Error(`Report with ID ${reportId} not found`);
    }
    
    // Override the empty data with our mock data
    response.data = report;
    
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}

/**
 * Fetches reports by type
 * @param type The type of reports to fetch
 * @param shouldFail Whether the request should fail (for testing error handling)
 */
export async function fetchReportsByType(
  type: 'sales' | 'user' | 'performance' | 'custom',
  shouldFail: boolean = false
): Promise<ApiResponse<ReportsData>> {
  try {
    const response = await apiClient.get<ReportsData>(`/reports/type/${type}`, shouldFail);
    
    // Filter reports by type
    const filteredReports = mockReportsData.reports.filter(r => r.type === type);
    
    // Override the empty data with our filtered mock data
    response.data = {
      reports: filteredReports,
      totalCount: filteredReports.length
    };
    
    return response;
  } catch (error) {
    return apiClient.handleError(error);
  }
}
