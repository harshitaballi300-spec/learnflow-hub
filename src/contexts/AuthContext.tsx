import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types/lms';
import { mockUser, mockAdmin } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  isAdmin: false,
  updateProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string) => {
    if (email === 'admin@example.com') {
      setUser(mockAdmin);
      return true;
    }
    setUser({ ...mockUser, email });
    return true;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<Pick<User, 'name' | 'email' | 'avatar'>>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin', updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
