import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, LoginData, RegisterData } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching profile
          const { user: currentUser } = await authService.getProfile();
          setUser(currentUser);
        } catch (error) {
          // Token is invalid, clear storage
          authService.logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await authService.login(data);
      
      authService.storeAuth(response.user, response.accessToken);
      setUser(response.user);
      
      toast.success(response.message || 'Login realizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      authService.storeAuth(response.user, response.accessToken);
      setUser(response.user);
      
      toast.success(response.message || 'Conta criada com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao criar conta';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    authService.storeAuth(updatedUser, authService.getStoredToken() || '');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};