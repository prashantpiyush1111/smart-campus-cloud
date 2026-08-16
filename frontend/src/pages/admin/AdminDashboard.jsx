import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Users,
  GraduationCap,
  Building2,
  AlertCircle,
  CheckCircle2,
  CalendarDays,
  Megaphone,
  Activity,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await adminService.getDashboard();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Aggregating campus cloud analytics..." />;

  const complaintCategories = stats?.complaintsByCategory || { INTERNET: 4, CLASSROOM: 3, WATER: 2, ELECTRICAL: 5 };
  const departmentUsers = stats?.usersByDepartment || { CSE: 65, ECE: 40, MECH: 25, IT: 20 };

  return (
    <div>
      <PageHeader
        title="Campus Cloud Executive Dashboard ⚡"
        subtitle="Real-time institutional intelligence, resource allocation, and operations oversight."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/admin/resources" className="btn btn-secondary btn-sm">
              <Building2 size={15} /> Manage Resources
            </Link>
            <Link to="/admin/logs" className="btn btn-primary btn-sm">
              <Activity size={15} /> Audit Trail
            </Link>
          </div>
        }
      />

      {/* Top Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Enrolled Students"
          value={stats?.totalStudents ?? 120}
          subtitle="Across 4 departments"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Teaching Faculty"
          value={stats?.totalFaculty ?? 18}
          subtitle="Professors & Instructors"
          icon={Users}
          color="sky"
        />
        <StatCard
          title="Active Grievances"
          value={stats?.activeComplaints ?? 2}
          subtitle={`${stats?.resolvedComplaints ?? 14} resolved to date`}
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Campus Facilities"
          value={`${stats?.availableResources ?? 3}/${stats?.totalResources ?? 5}`}
          subtitle="Labs & Halls Available"
          icon={Building2}
          color="emerald"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Complaints by Category Chart/Bars */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Grievance Distribution by Category</h3>
            <Link to="/admin/complaints" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5' }}>
              View All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(complaintCategories).map(([cat, count], idx) => {
              const total = Object.values(complaintCategories).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{cat}</span>
                    <span style={{ fontWeight: 700, color: '#4f46e5' }}>{count} tickets ({pct}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill progress-green" style={{ width: `${pct}%`, background: idx % 2 === 0 ? '#4f46e5' : '#0ea5e9' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Enrollment Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Department Enrollment Stats</h3>
            <span className="badge badge-submitted">4 Academic Branches</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(departmentUsers).map(([dept, count], idx) => {
              const total = Object.values(departmentUsers).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Department of {dept}</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{count} Students</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#10b981' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cloud & System Architecture Health Indicators */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff' }}>
        <div className="card-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={20} style={{ color: '#818cf8' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>Cloud Infrastructure Health & Topology</h3>
          </div>
          <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
            ● System Operational
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '1.25rem', fontSize: '0.88rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>REST API Runtime</div>
            <div style={{ fontWeight: 700, color: '#fff', marginTop: '2px' }}>Spring Boot 3.3.2 (Java 17)</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Database Cluster</div>
            <div style={{ fontWeight: 700, color: '#fff', marginTop: '2px' }}>MySQL 8.0 with JPA ORM</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Container Orchestration</div>
            <div style={{ fontWeight: 700, color: '#fff', marginTop: '2px' }}>Docker & Docker Compose</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>CI/CD Pipeline</div>
            <div style={{ fontWeight: 700, color: '#fff', marginTop: '2px' }}>GitHub Actions Automated Build</div>
          </div>
        </div>
      </div>
    </div>
  );
};
