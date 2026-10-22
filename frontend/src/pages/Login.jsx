import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, Lock, Mail, Sparkles, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';

export const Login = () => {
  const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const [email, setEmail] = useState(demoMode ? 'student@campus.edu' : '');
  const [password, setPassword] = useState(demoMode ? 'Student@123' : '');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (res.user.role === 'ROLE_FACULTY') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff' }}>
      {/* Left side branding showcase */}
      <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <div className="logo-badge" style={{ width: '48px', height: '48px' }}>
              <Cloud size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: 800 }}>Smart Campus Cloud</h1>
              <p style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>Enterprise Full-Stack Java Platform</p>
            </div>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, color: '#f8fafc', maxWidth: '480px', marginBottom: '1.5rem' }}>
            Next-Generation Academic & Campus Management.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '460px' }}>
            Seamlessly unifying Attendance, Grievance Triage, Leave Approvals, Campus Facilities, and Real-Time Analytics into a secure cloud environment.
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontSize: '0.92rem' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Role-Based Access Control (Student, Faculty & Admin)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontSize: '0.92rem' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Spring Security 6 & JWT Stateless Authentication
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', fontSize: '0.92rem' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Cloud Deployment Ready with Docker & Microservices
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          &copy; 2026 Smart Campus Cloud Management System. Built with Spring Boot 3, React 18, and MySQL 8.
        </div>
      </div>

      {/* Right side login form */}
      <div style={{ width: '520px', padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>Account Sign In</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>Enter your campus credentials to access your portal</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '38px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '38px', background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Demo credentials are intentionally hidden unless explicitly enabled at build time. */}
          {demoMode && <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Sparkles size={14} /> INSTANT DEMO EVALUATION LOGINS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('student@campus.edu', 'Student@123')}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                👨‍🎓 Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('faculty@campus.edu', 'Faculty@123')}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                👨‍🏫 Faculty
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@campus.edu', 'Admin@123')}
                style={{ background: '#334155', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                ⚡ Admin
              </button>
            </div>
          </div>}

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
            New student or faculty?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
              Register account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
