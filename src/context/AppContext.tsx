import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  DashboardData, 
  fetchDashboardData,
  AnalyticsData,
  fetchAnalyticsData,
  ReportsData,
  fetchReports
} from '../api';

interface AppContextType {
  // Navigation state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Data loading state
  isLoading: boolean;
  error: string | null;
  
  // API data
  dashboardData: DashboardData | null;
  analyticsData: AnalyticsData | null;
  reportsData: ReportsData | null;
  
  // Data fetching functions
  refreshDashboardData: (forceRefresh?: boolean) => Promise<void>;
  refreshAnalyticsData: (timeRange?: 'day' | 'week' | 'month' | 'year') => Promise<void>;
  refreshReportsData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Data loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };
  
  // Fetch dashboard data
  const refreshDashboardData = async (forceRefresh = false) => {
    // Skip if we already have data and aren't forcing a refresh
    if (dashboardData && !forceRefresh) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchDashboardData();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch analytics data
  const refreshAnalyticsData = async (timeRange: 'day' | 'week' | 'month' | 'year' = 'month') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchAnalyticsData(timeRange);
      
      if (response.success) {
        setAnalyticsData(response.data);
      } else {
        setError(response.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch reports data
  const refreshReportsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetchReports();
      
      if (response.success) {
        setReportsData(response.data);
      } else {
        setError(response.error || 'Failed to fetch reports data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'dashboard') {
      refreshDashboardData();
    } else if (activeTab === 'analytics') {
      refreshAnalyticsData();
    } else if (activeTab === 'reports') {
      refreshReportsData();
    }
  }, [activeTab]);

  return (
    <AppContext.Provider value={{ 
      // Navigation state
      activeTab, 
      setActiveTab, 
      sidebarCollapsed, 
      toggleSidebar,
      
      // Data loading state
      isLoading,
      error,
      
      // API data
      dashboardData,
      analyticsData,
      reportsData,
      
      // Data fetching functions
      refreshDashboardData,
      refreshAnalyticsData,
      refreshReportsData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
