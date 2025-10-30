import { useState, useEffect, createContext, useContext } from "react";
import { apiClient } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'consumer' | 'pharmacy' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: { name?: string; email?: string }) => Promise<void>;
  updatePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await apiClient.getCurrentUser();
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      const { user: userData, token: authToken } = response.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    try {
      const response = await apiClient.register(userData);
      const { user: newUser, token: authToken } = response.data;

      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('token', authToken);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (userData: { name?: string; email?: string }) => {
    try {
      const response = await apiClient.updateProfile(userData);
      setUser(response.data);
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      await apiClient.updatePassword(passwordData);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};