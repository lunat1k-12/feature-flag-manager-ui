import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { sidebarCollapsed } = useAppContext();

  return (
    <header 
      className={`bg-white border-b border-gray-200 fixed top-0 right-0 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-64'
      } z-10`}
    >
      <div className="flex justify-between items-center px-6 py-3">
        <h2 className="text-xl font-semibold text-gray-800">Environment</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <span className="text-gray-600">🔔</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium">US</span>
          </div>
        </div>
      </div>
    </header>
  );
}
