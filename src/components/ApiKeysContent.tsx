import { useAppContext } from '../context/AppContext';
import { ApiKey } from '../api';
import { useState } from 'react';

// Environment selector component (reused from EnvironmentContent)
function EnvironmentSelector() {
  const { environments, selectedEnvironment, setSelectedEnvironment } = useAppContext();

  if (!environments || environments.length === 0) {
    return <p className="text-gray-500">No environments available.</p>;
  }

  return (
    <div>
      <label htmlFor="environment-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Environment
      </label>
      <select
        id="environment-select"
        value={selectedEnvironment || ''}
        onChange={(e) => setSelectedEnvironment(e.target.value)}
        className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        {environments.map((env) => (
          <option key={env.name} value={env.name}>
            {env.name} - {env.description}
          </option>
        ))}
      </select>
    </div>
  );
}

// API Keys Table component
function ApiKeysTable({ apiKeys }: { apiKeys: ApiKey[] }) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // Toggle key visibility
  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Format key to show only first 5 symbols + **** when hidden
  const formatKey = (key: string, isVisible: boolean) => {
    if (isVisible) {
      return key;
    }
    return `${key.substring(0, 5)}****`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Key
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {apiKeys.map((apiKey) => (
            <tr key={apiKey.key}>
              <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-600 overflow-x-auto">
                <div className="flex items-center space-x-2">
                  <span>{formatKey(apiKey.key, !!visibleKeys[apiKey.key])}</span>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.key)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-2"
                  >
                    {visibleKeys[apiKey.key] ? 'Hide' : 'Show'}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  apiKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {apiKey.active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main API Keys content component
export default function ApiKeysContent() {
  const { apiKeys, selectedEnvironment, isLoading, error, generateNewApiKey } = useAppContext();

  // Handle generate API key button click
  const handleGenerateClick = async () => {
    if (selectedEnvironment) {
      await generateNewApiKey(selectedEnvironment);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <EnvironmentSelector />
        <button 
          onClick={handleGenerateClick}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate API Key
        </button>
      </div>

      {selectedEnvironment && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
          </div>

          {apiKeys && apiKeys.length > 0 ? (
            <ApiKeysTable apiKeys={apiKeys} />
          ) : (
            <p className="text-gray-500">No API keys available for this environment.</p>
          )}
        </div>
      )}
    </div>
  );
}
