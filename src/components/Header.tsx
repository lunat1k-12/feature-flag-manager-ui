import { useAppContext } from '../context/AppContext';
import { useAuth } from 'react-oidc-context';

export default function Header() {
  const { sidebarCollapsed } = useAppContext();
  const auth = useAuth();

  // Get initials for avatar
  const getInitials = () => {
    if (!auth.user?.profile.name) return 'U';
    return auth.user.profile.name.substring(0, 2).toUpperCase();
  };

  // Sign out function
  const signOutRedirect = () => {
    const clientId = "2eno1m49skl28h41v522dljlq8";
    const logoutUri = "http://localhost:5173/logout";
    const cognitoDomain = "https://feature-flip.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

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

          {/* User menu */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => document.getElementById('userDropdown')?.classList.toggle('hidden')}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <span className="text-sm font-medium">{getInitials()}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:inline-block">
                {auth.user?.profile.name || 'User'}
              </span>
            </button>

            {/* Dropdown menu */}
            <div 
              id="userDropdown" 
              className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">{auth.user?.profile.name || 'User'}</div>
                <div className="text-gray-500 truncate">{auth.user?.profile.email || ''}</div>
              </div>
              <button
                onClick={signOutRedirect}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
