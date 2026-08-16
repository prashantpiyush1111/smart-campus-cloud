import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  AlertCircle,
  FileText,
  Megaphone,
  CalendarDays,
  Building2,
  Users,
  GraduationCap,
  History,
  ShieldCheck,
  UserCheck,
  Sliders,
  Cloud
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isStudent, isFaculty, isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-badge">
          <Cloud size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Smart Campus
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cloud Edition
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* STUDENT NAVIGATION */}
        {isStudent && (
          <>
            <div className="nav-section-title">STUDENT PORTAL</div>
            <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span className="nav-label">Dashboard</span>
            </NavLink>
            <NavLink to="/student/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} />
              <span className="nav-label">My Attendance</span>
            </NavLink>
            <NavLink to="/student/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={18} />
              <span className="nav-label">Complaints</span>
            </NavLink>
            <NavLink to="/student/leave" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span className="nav-label">Leave Requests</span>
            </NavLink>
          </>
        )}

        {/* FACULTY NAVIGATION */}
        {isFaculty && (
          <>
            <div className="nav-section-title">FACULTY PORTAL</div>
            <NavLink to="/faculty/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span className="nav-label">Dashboard</span>
            </NavLink>
            <NavLink to="/faculty/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalendarCheck size={18} />
              <span className="nav-label">Mark Attendance</span>
            </NavLink>
            <NavLink to="/faculty/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} />
              <span className="nav-label">Assigned Students</span>
            </NavLink>
            <NavLink to="/faculty/leave-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span className="nav-label">Approve Leaves</span>
            </NavLink>
            <NavLink to="/faculty/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={18} />
              <span className="nav-label">Review Issues</span>
            </NavLink>
          </>
        )}

        {/* ADMIN NAVIGATION */}
        {isAdmin && (
          <>
            <div className="nav-section-title">ADMINISTRATION</div>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              <span className="nav-label">Admin Overview</span>
            </NavLink>
            <NavLink to="/admin/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <GraduationCap size={18} />
              <span className="nav-label">Manage Students</span>
            </NavLink>
            <NavLink to="/admin/faculty" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={18} />
              <span className="nav-label">Manage Faculty</span>
            </NavLink>
            <NavLink to="/admin/complaints" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <AlertCircle size={18} />
              <span className="nav-label">Complaints Center</span>
            </NavLink>
            <NavLink to="/admin/leave-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <FileText size={18} />
              <span className="nav-label">Leave Audits</span>
            </NavLink>
            <NavLink to="/admin/resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Building2 size={18} />
              <span className="nav-label">Campus Resources</span>
            </NavLink>
            <NavLink to="/admin/logs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <History size={18} />
              <span className="nav-label">Activity Audit Logs</span>
            </NavLink>
          </>
        )}

        {/* SHARED MODULES */}
        <div className="nav-section-title">CAMPUS HUB</div>
        <NavLink to="/announcements" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Megaphone size={18} />
          <span className="nav-label">Announcements</span>
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <CalendarDays size={18} />
          <span className="nav-label">Campus Events</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <UserCheck size={18} />
          <span className="nav-label">My Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="avatar-circle">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="user-mini-info" style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || 'Campus User'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'capitalize' }}>
              {user?.role?.replace('ROLE_', '').toLowerCase() || 'student'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
