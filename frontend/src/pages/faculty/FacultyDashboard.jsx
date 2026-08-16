import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { facultyService } from '../../services/facultyService';
import { commonService } from '../../services/commonService';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  CalendarCheck,
  FileText,
  AlertCircle,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [activeComplaints, setActiveComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashRes, leaveRes, compRes] = await Promise.all([
          facultyService.getDashboard(),
          facultyService.getLeaveRequests(),
          facultyService.getComplaints()
        ]);
        setStats(dashRes.data);
        setPendingLeaves(leaveRes.data?.filter(l => l.status === 'PENDING').slice(0, 3) || []);
        setActiveComplaints(compRes.data?.slice(0, 3) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Faculty Control Center..." />;

  return (
    <div>
      <PageHeader
        title={`Faculty Portal &mdash; ${user?.fullName || 'Professor'} 🎓`}
        subtitle="Manage lectures, mark student attendance, review leave applications, and triage student grievances."
        action={
          <Link to="/faculty/attendance" className="btn btn-primary">
            <CalendarCheck size={16} /> Mark Class Attendance
          </Link>
        }
      />

      {/* Top Metric Cards */}
      <div className="stat-grid">
        <StatCard
          title="Assigned Students"
          value={stats?.assignedStudentsCount ?? 45}
          subtitle="Department batch"
          icon={GraduationCap}
          color="indigo"
        />
        <StatCard
          title="Pending Leave Reviews"
          value={stats?.facultyPendingLeaves ?? 1}
          subtitle="Requires attention"
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Department Complaints"
          value={stats?.departmentComplaints ?? 4}
          subtitle="Campus infrastructure"
          icon={AlertCircle}
          color="sky"
        />
        <StatCard
          title="Active Courses"
          value="4"
          subtitle="Cloud, DB, Systems, AI"
          icon={CalendarCheck}
          color="emerald"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Pending Student Leaves Queue */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: '#f59e0b' }} />
              <h3 className="card-title">Pending Leave Requests</h3>
            </div>
            <Link to="/faculty/leave-requests" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5' }}>
              Review All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {pendingLeaves.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No pending leave applications.</p>
            ) : (
              pendingLeaves.map((l) => (
                <div key={l.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>
                      {l.student?.user?.fullName || 'Student'} ({l.student?.rollNumber || 'CS2024001'})
                    </strong>
                    <StatusBadge status={l.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>
                    📅 {l.startDate} to {l.endDate}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{l.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Complaints Requiring Action */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ color: '#4f46e5' }} />
              <h3 className="card-title">Recent Campus Complaints</h3>
            </div>
            <Link to="/faculty/complaints" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5' }}>
              Triage &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeComplaints.map((c) => (
              <div key={c.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{c.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {c.complaintCode} &bull; 📍 {c.location || 'General'}
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
