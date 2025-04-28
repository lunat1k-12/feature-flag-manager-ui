import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAuth } from 'react-oidc-context';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import CallbackPage from './components/CallbackPage';
import {JSX} from "react";

// Protected route component that redirects to login if not authenticated
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the protected content
  return children;
}

function App() {
  return (
    <Router>
      <AppProvider >
        <Routes>
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* OAuth callback route */}
          <Route path="/callback" element={<CallbackPage />} />

          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route - redirect to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;
