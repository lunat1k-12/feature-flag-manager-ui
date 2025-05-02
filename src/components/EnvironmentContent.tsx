import { useAppContext } from '../context/AppContext';
import { FeatureFlag } from '../api';
import { useState } from 'react';
import AddFeatureFlagModal from './AddFeatureFlagModal';
import DeleteFeatureFlagModal from './DeleteFeatureFlagModal';
import AddEnvironmentModal from './AddEnvironmentModal';

// Environment selector component
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

// Feature flag card component
function FeatureFlagCard({ 
  featureFlag, 
  onDelete 
}: { 
  featureFlag: FeatureFlag; 
  onDelete: (flag: FeatureFlag) => void;
}) {
  // Parse the config JSON
  const config = JSON.parse(featureFlag.config);

  // Determine the badge color based on the feature flag type
  const badgeColor = 
    featureFlag.type === 'SIMPLE' ? 'bg-green-100 text-green-800' :
    featureFlag.type === 'PERCENTAGE' ? 'bg-blue-100 text-blue-800' :
    featureFlag.type === 'STRING' ? 'bg-purple-100 text-purple-800' :
    featureFlag.type === 'NUMBER' ? 'bg-yellow-100 text-yellow-800' :
    'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-medium text-gray-900">{featureFlag.featureName}</h4>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
            {featureFlag.type}
          </span>
          <button 
            onClick={() => onDelete(featureFlag)}
            className="text-red-600 hover:text-red-800 text-sm"
            aria-label="Delete feature flag"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">Environment: {featureFlag.envName}</p>

      <div className="bg-gray-50 p-3 rounded-md">
        <h5 className="text-sm font-medium text-gray-700 mb-1">Configuration</h5>
        <div className="text-xs text-gray-600 font-mono overflow-x-auto">
          {(featureFlag.type === 'SIMPLE' || featureFlag.type === 'PERCENTAGE') && (
            <div className="flex items-center">
              <span className="mr-2">Enabled:</span>
              <span className={config.enabled ? 'text-green-600' : 'text-red-600'}>
                {config.enabled ? 'Yes' : 'No'}
              </span>
              {featureFlag.type === 'PERCENTAGE' && config.rolloutPercentage !== undefined && (
                <span className="ml-4">Rollout: {config.rolloutPercentage}%</span>
              )}
            </div>
          )}

          {featureFlag.type === 'STRING' && (
            <div>
              <span className="mr-2">Value:</span>
              <span className="text-blue-600">"{config.value}"</span>
            </div>
          )}

          {featureFlag.type !== 'SIMPLE' && featureFlag.type !== 'PERCENTAGE' && featureFlag.type !== 'STRING' && (
            <pre>{JSON.stringify(config, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

// Main environment content component
export default function EnvironmentContent() {
  const { featureFlags, selectedEnvironment, isLoading, error } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEnvironmentModalOpen, setIsAddEnvironmentModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [flagToDelete, setFlagToDelete] = useState<FeatureFlag | null>(null);

  // Handle delete button click
  const handleDeleteClick = (flag: FeatureFlag) => {
    setFlagToDelete(flag);
    setIsDeleteModalOpen(true);
  };

  // Handle close delete modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFlagToDelete(null);
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
      <AddFeatureFlagModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <AddEnvironmentModal
        isOpen={isAddEnvironmentModalOpen}
        onClose={() => setIsAddEnvironmentModalOpen(false)}
      />
      {flagToDelete && (
        <DeleteFeatureFlagModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          featureName={flagToDelete.featureName}
          envName={flagToDelete.envName}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <EnvironmentSelector />
        <button 
          onClick={() => setIsAddEnvironmentModalOpen(true)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Environment
        </button>
      </div>

      {selectedEnvironment && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Feature Flags</h3>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Flag
            </button>
          </div>

          {featureFlags && featureFlags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureFlags.map((flag) => (
                <FeatureFlagCard 
                  key={`${flag.envName}-${flag.featureName}`} 
                  featureFlag={flag} 
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No feature flags available for this environment.</p>
          )}
        </div>
      )}
    </div>
  );
}
