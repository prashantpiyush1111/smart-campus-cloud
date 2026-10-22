import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext();
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (!demoMode) return null;
    const saved = localStorage.getItem('smart_campus_user');
    return saved ? JSON.parse(saved) : mockUsers.student;
  });

  const [token, setToken] = useState(() =>
    demoMode ? (localStorage.getItem('smart_campus_jwt') || 'demo-jwt-token') : null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!demoMode) return;
    if (user) {
      localStorage.setItem('smart_campus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_campus_user');
    }
  }, [user]);

  useEffect(() => {
    if (!demoMode) return;
    if (token) {
      localStorage.setItem('smart_campus_jwt', token);
    } else {
      localStorage.removeItem('smart_campus_jwt');
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success && res.data) {
        setUser(res.data);
        setToken(res.data.token);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Login failed. Please check your credentials.' };
    } catch (err) {
      // Never turn rejected production credentials or network failures into a mock admin session.
      if (err.response) {
        return { success: false, message: err.response.data?.message || 'Login failed. Please check your credentials.' };
      }
      if (demoMode) {
        console.warn('Backend unavailable; using mock demo user');
        let mock = mockUsers.student;
        if (email.includes('admin')) mock = mockUsers.admin;
        else if (email.includes('faculty')) mock = mockUsers.faculty;
        setUser(mock);
        setToken(mock.token);
        return { success: true, user: mock };
      }
      return { success: false, message: 'Unable to reach the login service. Please try again later.' };
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
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Registration failed. Please try again.' };
    } catch (err) {
      if (err.response) {
        return { success: false, message: err.response.data?.message || 'Registration failed. Please try again.' };
      }
      if (demoMode) {
        const newUser = {
          ...mockUsers.student,
          email: userData.email,
          fullName: userData.fullName,
          role: userData.role,
          token: 'mock-jwt-reg-token'
        };
        setUser(newUser);
        setToken(newUser.token);
        return { success: true, user: newUser };
      }
      return { success: false, message: 'Unable to reach the registration service. Please try again later.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (demoMode) {
      localStorage.removeItem('smart_campus_user');
      localStorage.removeItem('smart_campus_jwt');
    }
  };

  const switchDemoRole = (roleType) => {
    if (!demoMode) return;
    const target = mockUsers[roleType] || mockUsers.student;
    setUser(target);
    setToken(target.token);
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
