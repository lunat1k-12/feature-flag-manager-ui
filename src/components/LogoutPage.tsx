import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export default function LogoutPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any remaining auth state
    auth.removeUser();
    
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);

    return () => clearTimeout(timer);
  }, [auth, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Signing Out
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You have been successfully signed out.
          </p>
        </div>
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
}