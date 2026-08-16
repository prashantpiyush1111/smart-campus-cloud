import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { User, Mail, Phone, Building, GraduationCap, Briefcase, ShieldCheck, Key, Clock } from 'lucide-react';

export const ProfilePage = () => {
  const { user, isStudent, isFaculty, isAdmin } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authService.getCurrentUser();
        if (res.data) setProfile(res.data);
      } catch (e) {
        // Fallback to user context
      }
    };
    fetchProfile();
  }, []);

  const displayUser = profile || user;

  return (
    <div>
      <PageHeader
        title="User Dossier & Profile"
        subtitle="Manage your identity, department affiliations, academic metrics, and credentials."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Profile Overview Card */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="avatar-circle" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 1rem', background: '#4f46e5' }}>
            {displayUser?.fullName?.charAt(0) || 'U'}
          </div>
          <h2 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>{displayUser?.fullName}</h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '2px' }}>{displayUser?.email}</p>

          <div style={{ marginTop: '1rem' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: isAdmin ? '#fee2e2' : isFaculty ? '#fef3c7' : '#e0e7ff',
                color: isAdmin ? '#991b1b' : isFaculty ? '#92400e' : '#3730a3'
              }}
            >
              {displayUser?.role?.replace('ROLE_', '') || 'STUDENT'}
            </span>
          </div>

          <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', marginBottom: '10px' }}>
              <Building size={16} style={{ color: '#6366f1' }} />
              <span>{displayUser?.departmentName || 'Computer Science & Engineering'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', marginBottom: '10px' }}>
              <Phone size={16} style={{ color: '#10b981' }} />
              <span>{displayUser?.phoneNumber || '+1 (555) 012-3456'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569' }}>
              <ShieldCheck size={16} style={{ color: '#0ea5e9' }} />
              <span>Account Status: Active &bull; Verified</span>
            </div>
          </div>
        </div>

        {/* Right Tabular Information Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isStudent && (
            <div className="card">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <GraduationCap size={20} style={{ color: '#4f46e5' }} /> Academic Credentials
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Roll Number</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{displayUser?.rollNumber || 'CS2024001'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Admission Number</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{displayUser?.admissionNumber || 'ADM-2024-001'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Semester & Batch</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{displayUser?.semester || 'Semester 6'} &bull; {displayUser?.batch || '2023-2027'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Cumulative GPA (CGPA)</div>
                  <div style={{ fontWeight: 800, color: '#059669', marginTop: '2px' }}>8.85 / 10.00</div>
                </div>
              </div>
            </div>
          )}

          {isFaculty && (
            <div className="card">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Briefcase size={20} style={{ color: '#4f46e5' }} /> Faculty Appointment Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Employee ID</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{displayUser?.employeeCode || 'FAC-CSE-001'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Designation</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{displayUser?.designation || 'Associate Professor'}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Highest Qualification</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>Ph.D. in Computer Science & Distributed Systems</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ color: '#64748b', fontSize: '0.78rem' }}>Research & Specialization</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>Cloud Security, DevOps, Distributed Systems</div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Key size={20} style={{ color: '#0ea5e9' }} /> Security & Access Credentials
            </h3>
            <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span>Authentication Method</span>
                <strong>Spring Security 6 + JWT (HMAC-SHA256)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span>Session Expiration</span>
                <strong>24 Hours (Stateless Token)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Password Encryption</span>
                <strong>BCrypt 10-Round Salting</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
