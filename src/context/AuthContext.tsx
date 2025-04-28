import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {User} from "oidc-client-ts";

// Define the user type
interface AppUser {
  username: string;
  email?: string;
  token: string;
}

// Define the auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  login: (redirectUri?: string) => void;
  logout: () => void;
  handleAuthCallback: (code: string) => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cognito configuration from environment variables or hardcoded for development
const cognitoConfig = {
  clientId: '2eno1m49skl28h41v522dljlq8',
  domain: 'feature-flip.auth.us-east-1.amazoncognito.com',
  redirectUri: 'http://localhost:5173/callback',
  scope: 'email openid profile',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AppUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Validate token or refresh if needed
          // For now, we'll just assume it's valid
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          setUser({
            username: userData.username || 'user',
            email: userData.email,
            token
          });
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        // Clear any invalid auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect to Cognito login page
  const login = (redirectUri?: string) => {
    const authEndpoint = `https://${cognitoConfig.domain}/oauth2/authorize`;
    const queryParams = new URLSearchParams({
      client_id: cognitoConfig.clientId,
      response_type: 'code',
      scope: cognitoConfig.scope,
      redirect_uri: redirectUri || cognitoConfig.redirectUri,
    });

    window.location.href = `${authEndpoint}?${queryParams.toString()}`;
  };

  // Handle the auth callback with code from Cognito
  const handleAuthCallback = async (code: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, you would exchange the code for tokens
      // by calling your backend API that handles the token exchange
      const response = await fetch('http://localhost:8080/user-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with the server');
      }

      const data = await response.json();
      
      // Store the token and user data
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      console.log(`Use data - ${JSON.stringify(data)}`);
      // Update state
      setUser({
        username: data.user.username,
        email: data.user.email,
        token: data.token
      });
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Authentication failed:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout the user
  const logout = () => {
    // Clear auth data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        error,
        login,
        logout,
        handleAuthCallback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}