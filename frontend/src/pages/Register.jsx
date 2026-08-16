import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cloud, Lock, Mail, User, Phone, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'ROLE_STUDENT',
    phoneNumber: '',
    departmentId: 1,
    rollNumber: '',
    admissionNumber: '',
    semester: 'Semester 1',
    batch: '2024-2028',
    guardianName: '',
    guardianContact: '',
    employeeCode: '',
    designation: 'Assistant Professor',
    qualification: 'M.Tech / Ph.D',
    specialization: ''
  });

  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      if (formData.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (formData.role === 'ROLE_FACULTY') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '2rem' }}>
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', maxWidth: '640px', width: '100%', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo-badge" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}>
            <Cloud size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>Campus Portal Registration</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '4px' }}>Create an account to join the Smart Campus Cloud system</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Role selector tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.5rem', background: '#0f172a', padding: '6px', borderRadius: '10px' }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ROLE_STUDENT' })}
              style={{
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: formData.role === 'ROLE_STUDENT' ? '#4f46e5' : 'transparent',
                color: formData.role === 'ROLE_STUDENT' ? '#fff' : '#94a3b8'
              }}
            >
              <GraduationCap size={18} /> Student Account
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'ROLE_FACULTY' })}
              style={{
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: formData.role === 'ROLE_FACULTY' ? '#4f46e5' : 'transparent',
                color: formData.role === 'ROLE_FACULTY' ? '#fff' : '#94a3b8'
              }}
            >
              <Briefcase size={18} /> Faculty Account
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                placeholder="user@campus.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Password *</label>
              <input
                type="password"
                name="password"
                className="form-control"
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-control"
                style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ color: '#cbd5e1' }}>Department</label>
            <select
              name="departmentId"
              className="form-control"
              style={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }}
              value={formData.departmentId}
              onChange={handleChange}
            >
              <option value="1">Computer Science & Engineering (CSE)</option>
              <option value="2">Electronics & Communication Engineering (ECE)</option>
              <option value="3">Mechanical Engineering (MECH)</option>
              <option value="4">Information Technology (IT)</option>
            </select>
          </div>

          {/* Student-specific fields */}
          {formData.role === 'ROLE_STUDENT' && (
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    className="form-control"
                    style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                    placeholder="e.g. CS2024099"
                    value={formData.rollNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Semester</label>
                  <select
                    name="semester"
                    className="form-control"
                    style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                    value={formData.semester}
                    onChange={handleChange}
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Faculty-specific fields */}
          {formData.role === 'ROLE_FACULTY' && (
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Employee Code</label>
                  <input
                    type="text"
                    name="employeeCode"
                    className="form-control"
                    style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                    placeholder="e.g. FAC-CSE-099"
                    value={formData.employeeCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: '#cbd5e1' }}>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    className="form-control"
                    style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff' }}
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};
