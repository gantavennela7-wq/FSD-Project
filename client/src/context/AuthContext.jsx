import React, { createContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';
import { useAuth } from './useAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lms_token') || null);
  const [loading, setLoading] = useState(true);

  // Check current auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('lms_token');
      if (storedToken) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('lms_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('lms_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    // Accepts either object or individual arguments for backwards compatibility
    const payload = typeof userData === 'object' ? userData : { name: arguments[0], email: arguments[1], password: arguments[2] };
    const data = await authService.register(payload);
    localStorage.setItem('lms_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const res = await userService.updateProfile(updatedData);
    setUser((prev) => ({ ...prev, ...res }));
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFaculty: user?.role === 'faculty',
        isStudent: user?.role === 'student'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
export default AuthContext;
