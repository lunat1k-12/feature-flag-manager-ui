import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { createFeatureFlag, FeatureFlagRequest } from '../api';

interface AddFeatureFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFeatureFlagModal({ isOpen, onClose }: AddFeatureFlagModalProps) {
  const { selectedEnvironment, refreshFeatureFlags } = useAppContext();

  // Form state
  const [featureName, setFeatureName] = useState('');
  const [flagType, setFlagType] = useState<'SIMPLE' | 'PERCENTAGE'>('SIMPLE');
  const [enabled, setEnabled] = useState(true);
  const [percentage, setPercentage] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form state
  const resetForm = () => {
    setFeatureName('');
    setFlagType('SIMPLE');
    setEnabled(true);
    setPercentage(100);
    setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEnvironment) {
      setError('No environment selected');
      return;
    }

    if (!featureName.trim()) {
      setError('Feature flag name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Create config object based on flag type
      const config = flagType === 'SIMPLE' 
        ? { enabled } 
        : { enabled, rolloutPercentage: percentage };

      // Create feature flag request
      const featureFlagRequest: FeatureFlagRequest = {
        envName: selectedEnvironment,
        type: flagType, // Using SIMPLE or PERCENTAGE as the type
        featureName: featureName.trim(),
        config: JSON.stringify(config)
      };

      // Call API to create feature flag
      const response = await createFeatureFlag(featureFlagRequest);

      if (response.success) {
        // Refresh feature flags to show the new one
        await refreshFeatureFlags(selectedEnvironment);
        resetForm();
        onClose();
      } else {
        setError(response.error || 'Failed to create feature flag');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Feature Flag</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Feature Flag Name */}
          <div className="mb-4">
            <label htmlFor="featureName" className="block text-sm font-medium text-gray-700 mb-1">
              FF Name
            </label>
            <input
              id="featureName"
              type="text"
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter feature flag name"
            />
          </div>

          {/* Feature Flag Type */}
          <div className="mb-4">
            <label htmlFor="flagType" className="block text-sm font-medium text-gray-700 mb-1">
              FF Type
            </label>
            <select
              id="flagType"
              value={flagType}
              onChange={(e) => setFlagType(e.target.value as 'SIMPLE' | 'PERCENTAGE')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="SIMPLE">SIMPLE</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
            </select>
          </div>

          {/* Enabled Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
                Enabled
              </label>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle enabled</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Percentage Input (only shown for PERCENTAGE type) */}
          {flagType === 'PERCENTAGE' && (
            <div className="mb-4">
              <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
                Percentage (0-100)
              </label>
              <input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
