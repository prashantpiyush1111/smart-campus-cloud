import React, { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';
import { setAccessToken } from '../services/api';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);


  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token);
        setAccessToken(res.data.token);
        return { success: true, user: res.data };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      if (err.response) {
        setUser(null);
        setToken(null);
        setAccessToken(null);
        return { success: false, message: err.response.data?.message || 'Login failed. Please check your credentials or try again later.' };
      }
      console.warn('Backend unavailable; using mock demo user');
      // Fallback matching
      let mock = mockUsers.student;
      if (email.includes('admin')) mock = mockUsers.admin;
      else if (email.includes('faculty')) mock = mockUsers.faculty;
      setUser(mock);
      setToken(mock.token);
      setAccessToken(mock.token);
      return { success: true, user: mock };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token);
        setAccessToken(res.data.token);
        return { success: true, user: res.data };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      if (err.response) {
        return { success: false, message: err.response.data?.message || 'Registration failed. Please try again.' };
      }
      // Mock registration fallback
      const newUser = {
        ...mockUsers.student,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        token: 'mock-jwt-reg-token'
      };
      setUser(newUser);
      setToken(newUser.token);
      setAccessToken(newUser.token);
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Send revocation while the current token is still available to the API client.
    if (token && !String(token).startsWith('mock-') && token !== 'demo-jwt-token') {
      authService.logout(token).catch(() => {});
    }
    setAccessToken(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_campus_user');
  };

  // Quick switch for examiners / demo
  const switchDemoRole = (roleType) => {
    const target = mockUsers[roleType] || mockUsers.student;
    setUser(target);
    setToken(target.token);
    setAccessToken(target.token);
  };

  const isStudent = user?.role === 'ROLE_STUDENT';
  const isFaculty = user?.role === 'ROLE_FACULTY';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        isStudent,
        isFaculty,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
