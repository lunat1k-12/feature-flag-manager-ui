import { useAppContext } from '../context/AppContext';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'reports', label: 'Reports', icon: '📄' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useAppContext();
  
  // Handle menu item click
  const handleMenuItemClick = (id: string) => {
    setActiveTab(id);
  };
  
  return (
    <aside 
      className={`bg-gray-800 text-white transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } h-screen fixed left-0 top-0 z-10`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold">App Name</h1>
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
            <li key={item.id}>
              <button 
                onClick={() => handleMenuItemClick(item.id)}
                className={`flex items-center w-full text-left p-3 rounded-md transition-colors ${
                  activeTab === item.id 
                    ? 'bg-gray-700 text-white' 
                    : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="ml-3">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
