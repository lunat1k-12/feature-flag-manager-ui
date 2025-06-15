import { useAppContext } from '../context/AppContext';
import { useEffect } from 'react';
import FeatureMetricsChart from './charts/FeatureMetricsChart';

export default function MetricsContent() {
  const { 
    selectedEnvironment, 
    environments,
    setSelectedEnvironment,
    metrics,
    metricsType,
    setMetricsType,
    refreshMetrics,
    isLoading,
    error
  } = useAppContext();

  // Note: Metrics loading is handled by AppContext useEffect
  // No need for additional useEffect here to prevent duplicate API calls

  // Handle environment change
  const handleEnvironmentChange = (envName: string) => {
    setSelectedEnvironment(envName);
  };

  // Handle metrics type toggle
  const handleMetricsTypeChange = (type: 'day' | 'week') => {
    setMetricsType(type);
  };

  if (!environments || environments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No environments available. Please create an environment first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Environment Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label htmlFor="environment-select" className="text-sm font-medium text-gray-700">
            Environment:
          </label>
          <select
            id="environment-select"
            value={selectedEnvironment || ''}
            onChange={(e) => handleEnvironmentChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {environments.map((env) => (
              <option key={env.name} value={env.name}>
                {env.name}
              </option>
            ))}
          </select>
        </div>

        {/* Day/Week Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Period:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleMetricsTypeChange('day')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                metricsType === 'day'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => handleMetricsTypeChange('week')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                metricsType === 'week'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading metrics</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Metrics Content */}
      {!isLoading && !error && metrics && (
        <div className="space-y-6">
          {metrics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics data available</h3>
              <p className="text-gray-500">
                No feature flag usage data found for the selected environment and time period.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {metrics.map((featureMetric) => (
                <FeatureMetricsChart
                  key={featureMetric.featureName}
                  featureMetrics={featureMetric}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
