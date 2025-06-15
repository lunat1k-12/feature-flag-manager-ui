import { useAppContext } from '../context/AppContext';
import { ReactNode } from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const FlagIcon = () => (
  <img src="/flag.svg" alt="Flag" width="24" height="24" />
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

const MetricsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
  </svg>
);

const menuItems: MenuItem[] = [
  { id: 'environment', label: 'Environment', icon: <FlagIcon /> },
  { id: 'apikeys', label: 'API Keys', icon: <KeyIcon /> },
  { id: 'metrics', label: 'Metrics', icon: <MetricsIcon /> },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useAppContext();

  // Handle menu item click
  const handleMenuItemClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <>
      <aside 
        className={`bg-gray-800 text-white transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } h-screen fixed left-0 top-0 z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold">FF Manager</h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <div className="flex items-center">
                  <button 
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`flex items-center w-full text-left p-3 rounded-md transition-colors ${
                      activeTab === item.id 
                        ? 'bg-gray-700 text-white' 
                        : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center justify-center">{item.icon}</span>
                    {!sidebarCollapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
