import { useAppContext } from '../context/AppContext';
import EnvironmentContent from './EnvironmentContent';

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Error message component
function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p className="font-medium">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default function Content() {
  const { 
    sidebarCollapsed,
    isLoading,
    error
  } = useAppContext();


  return (
    <main 
      className={`bg-gray-100 min-h-screen pt-24 pb-6 px-6 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Environment Management
        </h3>

        {/* Error message */}
        {error && <ErrorMessage message={error} />}

        {/* Loading indicator */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <EnvironmentContent />
          </div>
        )}
      </div>
    </main>
  );
}
