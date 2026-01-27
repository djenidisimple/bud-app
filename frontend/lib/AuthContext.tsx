import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { AxiosInstance } from 'axios';
import { axiosInstance } from './axios';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const api: AxiosInstance = axiosInstance.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
  });

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/api/user');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
      try {
          const response = await api.post('/api/login', { email, password });
          setUser(response.data.user);
          router.push('/dashboard');
      } catch (error) {
          console.error('Login failed:', error);
          throw error;
      }
  };

  const logout = async () => {
    try {
        await api.post('/api/logout');
        setUser(null);
        router.push('/login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
  };

  const value = {
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};