import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { deleteFeatureFlag } from '../api';

interface DeleteFeatureFlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  envName: string;
}

export default function DeleteFeatureFlagModal({ 
  isOpen, 
  onClose, 
  featureName, 
  envName 
}: DeleteFeatureFlagModalProps) {
  const { refreshFeatureFlags } = useAppContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      // Call API to delete feature flag
      const response = await deleteFeatureFlag(envName, featureName);

      if (response.success) {
        // Refresh feature flags to update the list
        await refreshFeatureFlags(envName);
        onClose();
      } else {
        setError(response.error || 'Failed to delete feature flag');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Delete Feature Flag</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Error message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the feature flag "{featureName}" from environment "{envName}"?
          </p>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              No
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
