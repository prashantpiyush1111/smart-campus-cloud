import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Bell, LogOut, User, Sparkles, CheckCheck, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Administrator';
    if (user?.role === 'ROLE_FACULTY') return 'Faculty Member';
    return 'Student';
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
          Welcome, <strong style={{ color: '#0f172a' }}>{user?.fullName || 'User'}</strong>
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            background: user?.role === 'ROLE_ADMIN' ? '#fee2e2' : user?.role === 'ROLE_FACULTY' ? '#fef3c7' : '#e0e7ff',
            color: user?.role === 'ROLE_ADMIN' ? '#991b1b' : user?.role === 'ROLE_FACULTY' ? '#92400e' : '#3730a3'
          }}
        >
          {getRoleLabel()}
        </span>
      </div>

      <div className="nav-right-actions">
        {/* Demo role switching is disabled by default and must be explicitly enabled. */}
        {demoMode && <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#4f46e5'
            }}
          >
            <Sparkles size={15} /> Switch Demo Role
          </button>

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '8px',
                width: '180px',
                zIndex: 50
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', padding: '4px 8px', fontWeight: 700 }}>QUICK PREVIEW</div>
              <button
                onClick={() => { switchDemoRole('student'); setShowRoleMenu(false); navigate('/student/dashboard'); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', background: user?.role === 'ROLE_STUDENT' ? '#eef2ff' : 'transparent', color: '#1e293b' }}
              >
                👨‍🎓 Student Portal
              </button>
              <button
                onClick={() => { switchDemoRole('faculty'); setShowRoleMenu(false); navigate('/faculty/dashboard'); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', background: user?.role === 'ROLE_FACULTY' ? '#eef2ff' : 'transparent', color: '#1e293b' }}
              >
                👨‍🏫 Faculty Portal
              </button>
              <button
                onClick={() => { switchDemoRole('admin'); setShowRoleMenu(false); navigate('/admin/dashboard'); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', background: user?.role === 'ROLE_ADMIN' ? '#eef2ff' : 'transparent', color: '#1e293b' }}
              >
                ⚡ Admin Portal
              </button>
            </div>
          )}
        </div>}

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            style={{
              position: 'relative',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '8px',
              borderRadius: '8px',
              color: '#475569'
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#e11d48',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                width: '320px',
                zIndex: 50,
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} style={{ fontSize: '0.75rem', color: '#4f46e5', background: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div style={{ padding: '8px' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '16px' }}>No notifications</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '4px',
                        background: n.read ? '#fff' : '#f8fafc',
                        borderLeft: n.read ? 'none' : '3px solid #4f46e5',
                        cursor: 'pointer',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{n.title}</div>
                      <div style={{ color: '#64748b', marginTop: '2px', fontSize: '0.78rem' }}>{n.message}</div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ padding: '8px', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                <Link to="/notifications" onClick={() => setShowNotifs(false)} style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4f46e5' }}>
                  View All Notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Link */}
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#334155',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
        >
          <div className="avatar-circle" style={{ width: '34px', height: '34px' }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fee2e2',
            padding: '7px 12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}
          title="Logout"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
};
