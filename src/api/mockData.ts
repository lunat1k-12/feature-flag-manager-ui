/**
 * Mock data for API responses
 */

// Dashboard Types
export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral';
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

export interface RecentActivity {
  id: string;
  message: string;
  timestamp: string;
  type: 'user' | 'order' | 'project' | 'system';
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface DashboardData {
  metrics: DashboardMetric[];
  recentActivity: RecentActivity[];
}

// Analytics Types
export interface AnalyticsDataPoint {
  date: string;
  users: number;
  revenue: number;
  orders: number;
}

export interface AnalyticsData {
  timeRange: 'day' | 'week' | 'month' | 'year';
  dataPoints: AnalyticsDataPoint[];
  totals: {
    users: number;
    revenue: number;
    orders: number;
  };
}

// Reports Types
export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  type: 'sales' | 'user' | 'performance' | 'custom';
  status: 'ready' | 'generating' | 'failed';
}

export interface ReportsData {
  reports: Report[];
  totalCount: number;
}

// Mock Dashboard Data
export const mockDashboardData: DashboardData = {
  metrics: [
    {
      id: 'total-users',
      label: 'Total Users',
      value: 1234,
      change: 12,
      changeLabel: 'from last month',
      trend: 'up',
      color: 'blue'
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: '$12,345',
      change: 8,
      changeLabel: 'from last month',
      trend: 'up',
      color: 'green'
    },
    {
      id: 'active-projects',
      label: 'Active Projects',
      value: 42,
      change: 3,
      changeLabel: 'from last month',
      trend: 'up',
      color: 'purple'
    }
  ],
  recentActivity: [
    {
      id: 'act-1',
      message: 'User John Doe completed profile setup',
      timestamp: '2025-04-09T14:32:17Z',
      type: 'user',
      user: {
        id: 'user-1',
        name: 'John Doe'
      }
    },
    {
      id: 'act-2',
      message: 'New order #12345 received',
      timestamp: '2025-04-09T13:45:00Z',
      type: 'order'
    },
    {
      id: 'act-3',
      message: 'Project "Website Redesign" status updated to "In Progress"',
      timestamp: '2025-04-09T11:20:45Z',
      type: 'project'
    },
    {
      id: 'act-4',
      message: 'System update completed successfully',
      timestamp: '2025-04-09T10:05:30Z',
      type: 'system'
    },
    {
      id: 'act-5',
      message: 'User Jane Smith uploaded new documents',
      timestamp: '2025-04-09T09:15:22Z',
      type: 'user',
      user: {
        id: 'user-2',
        name: 'Jane Smith'
      }
    }
  ]
};

// Mock Analytics Data
export const mockAnalyticsData: AnalyticsData = {
  timeRange: 'month',
  dataPoints: [
    { date: '2025-03-10', users: 120, revenue: 5400, orders: 28 },
    { date: '2025-03-17', users: 132, revenue: 6200, orders: 32 },
    { date: '2025-03-24', users: 141, revenue: 6800, orders: 35 },
    { date: '2025-03-31', users: 145, revenue: 7100, orders: 36 },
    { date: '2025-04-07', users: 152, revenue: 7400, orders: 38 }
  ],
  totals: {
    users: 690,
    revenue: 32900,
    orders: 169
  }
};

// Mock Reports Data
export const mockReportsData: ReportsData = {
  reports: [
    {
      id: 'rep-1',
      title: 'Q1 Sales Report',
      description: 'Quarterly sales analysis for Q1 2025',
      createdAt: '2025-04-01T09:00:00Z',
      updatedAt: '2025-04-01T09:00:00Z',
      type: 'sales',
      status: 'ready'
    },
    {
      id: 'rep-2',
      title: 'User Acquisition Analysis',
      description: 'Analysis of user acquisition channels',
      createdAt: '2025-04-05T14:30:00Z',
      updatedAt: '2025-04-05T14:30:00Z',
      type: 'user',
      status: 'ready'
    },
    {
      id: 'rep-3',
      title: 'System Performance Review',
      description: 'Monthly system performance metrics',
      createdAt: '2025-04-08T11:15:00Z',
      updatedAt: '2025-04-08T11:15:00Z',
      type: 'performance',
      status: 'generating'
    },
    {
      id: 'rep-4',
      title: 'Custom Marketing Report',
      description: 'Custom report for marketing campaign effectiveness',
      createdAt: '2025-04-07T16:45:00Z',
      updatedAt: '2025-04-07T16:45:00Z',
      type: 'custom',
      status: 'ready'
    }
  ],
  totalCount: 4
};
