import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Environment,
  FeatureFlag,
  fetchEnvironments,
  fetchFeatureFlags,
  apiClient
} from '../api';
import {useAuth} from "react-oidc-context";

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
  environments: Environment[] | null;
  selectedEnvironment: string | null;
  featureFlags: FeatureFlag[] | null;

  // Data fetching functions
  refreshEnvironments: (forceRefresh: boolean) => Promise<void>;
  refreshFeatureFlags: (envName: string) => Promise<void>;
  setSelectedEnvironment: (envName: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Navigation state
  const [activeTab, setActiveTab] = useState('environment');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data loading state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API data
  const [environments, setEnvironments] = useState<Environment[] | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[] | null>(null);

  const { user } = useAuth();

  // Set user in apiClient when it changes
  useEffect(() => {
    apiClient.setUser(user);
  }, [user]);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Fetch environments data
  const refreshEnvironments = async (forceRefresh: boolean) => {
    // Skip if we already have data and aren't forcing a refresh
    if (environments && !forceRefresh) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchEnvironments();

      if (response.success) {
        setEnvironments(response.data);
        // Set the first environment as selected if none is selected
        if (response.data.length > 0 && !selectedEnvironment) {
          setSelectedEnvironment(response.data[0].name);
        }
      } else {
        setError(response.error || 'Failed to fetch environments data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch feature flags for a specific environment
  const refreshFeatureFlags = async (envName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFeatureFlags(envName, false);

      if (response.success) {
        setFeatureFlags(response.data);
      } else {
        setError(response.error || 'Failed to fetch feature flags data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load environment data when component mounts
  useEffect(() => {
    if (user) {
      refreshEnvironments(false);
    }
  }, [user]);

  // Load feature flags when selected environment changes
  useEffect(() => {
    if (selectedEnvironment && user) {
      refreshFeatureFlags(selectedEnvironment);
    }
  }, [selectedEnvironment, user]);

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
      environments,
      selectedEnvironment,
      featureFlags,

      // Data fetching functions
      refreshEnvironments,
      refreshFeatureFlags,
      setSelectedEnvironment
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
