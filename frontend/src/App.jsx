import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentAttendance } from './pages/student/StudentAttendance';
import { StudentComplaints } from './pages/student/StudentComplaints';
import { StudentLeave } from './pages/student/StudentLeave';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyAttendance } from './pages/faculty/FacultyAttendance';
import { FacultyLeave } from './pages/faculty/FacultyLeave';
import { FacultyComplaints } from './pages/faculty/FacultyComplaints';
import { FacultyStudents } from './pages/faculty/FacultyStudents';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminFaculty } from './pages/admin/AdminFaculty';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminLeave } from './pages/admin/AdminLeave';
import { AdminResources } from './pages/admin/AdminResources';
import { AdminLogs } from './pages/admin/AdminLogs';

// Common Pages
import { AnnouncementsPage } from './pages/common/AnnouncementsPage';
import { EventsPage } from './pages/common/EventsPage';
import { NotificationsPage } from './pages/common/NotificationsPage';
import { ProfilePage } from './pages/common/ProfilePage';
import { NotFound } from './pages/common/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to user's appropriate default dashboard
    if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'ROLE_FACULTY') return <Navigate to="/faculty/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

// Root Dashboard Redirector based on user role
const RootRedirector = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'ROLE_FACULTY') return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

// Main Layout with Navbar, Sidebar, and Content Container
const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root Dispatcher */}
            <Route path="/" element={<RootRedirector />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><StudentDashboard /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/attendance"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><StudentAttendance /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/complaints"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><StudentComplaints /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/leave"
              element={
                <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><StudentLeave /></MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Faculty Routes */}
            <Route
              path="/faculty/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><FacultyDashboard /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/attendance"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><FacultyAttendance /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/students"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><FacultyStudents /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/leave-requests"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><FacultyLeave /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/faculty/complaints"
              element={
                <ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_ADMIN']}>
                  <MainLayout><FacultyComplaints /></MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminDashboard /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminStudents /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/faculty"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminFaculty /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminComplaints /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leave-requests"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminLeave /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/resources"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminResources /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <MainLayout><AdminLogs /></MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Common Authenticated Routes */}
            <Route
              path="/announcements"
              element={
                <ProtectedRoute>
                  <MainLayout><AnnouncementsPage /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <MainLayout><EventsPage /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <MainLayout><NotificationsPage /></MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout><ProfilePage /></MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <MainLayout><NotFound /></MainLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
