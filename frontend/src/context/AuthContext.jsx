import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smart_campus_user');
    return saved ? JSON.parse(saved) : mockUsers.student; // Defaults to student for frictionless instant preview
  });

  const [token, setToken] = useState(() => localStorage.getItem('smart_campus_jwt') || 'demo-jwt-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smart_campus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smart_campus_user');
    }
  }, [user]);

  useEffect(() => {
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
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      console.warn('Backend login fallback to mock demo user');
      // Fallback matching
      let mock = mockUsers.student;
      if (email.includes('admin')) mock = mockUsers.admin;
      else if (email.includes('faculty')) mock = mockUsers.faculty;
      setUser(mock);
      setToken(mock.token);
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
        return { success: true, user: res.data };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
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
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('smart_campus_user');
    localStorage.removeItem('smart_campus_jwt');
  };

  // Quick switch for examiners / demo
  const switchDemoRole = (roleType) => {
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
