import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { commonService } from '../../services/commonService';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  CalendarCheck,
  AlertCircle,
  FileText,
  Bell,
  ArrowRight,
  TrendingUp,
  Megaphone,
  CalendarDays,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [attendanceSummaries, setAttendanceSummaries] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashRes, attRes, annRes, evtRes] = await Promise.all([
          studentService.getDashboard(),
          studentService.getAttendanceSummary(),
          commonService.getAnnouncements(),
          commonService.getUpcomingEvents()
        ]);
        setStats(dashRes.data);
        setAttendanceSummaries(attRes.data || []);
        setAnnouncements(annRes.data?.slice(0, 3) || []);
        setEvents(evtRes.data?.slice(0, 3) || []);
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your student portal..." />;

  const attendancePct = stats?.overallAttendancePercentage ?? 93.1;
  const isAttendanceSafe = attendancePct >= 75.0;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'Student'}! 👋`}
        subtitle="Here is an overview of your academic attendance, grievances, and campus updates."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/student/complaints" className="btn btn-secondary btn-sm">
              <AlertCircle size={15} /> Lodge Complaint
            </Link>
            <Link to="/student/leave" className="btn btn-primary btn-sm">
              <Plus size={15} /> Apply for Leave
            </Link>
          </div>
        }
      />

      {/* Top Stat Cards */}
      <div className="stat-grid">
        <StatCard
          title="Overall Attendance"
          value={`${attendancePct}%`}
          subtitle={isAttendanceSafe ? 'Above minimum requirement (75%)' : 'Warning: Below 75% limit'}
          icon={CalendarCheck}
          color={isAttendanceSafe ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Active Complaints"
          value={stats?.totalComplaintsSubmitted ?? 3}
          subtitle="Tracked in real-time"
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Leave Applications"
          value={stats?.totalLeavesSubmitted ?? 2}
          subtitle="Approved / In review"
          icon={FileText}
          color="indigo"
        />
        <StatCard
          title="Unread Alerts"
          value={stats?.unreadNotificationsCount ?? 2}
          subtitle="Latest updates"
          icon={Bell}
          color="sky"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Subject-Wise Attendance Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Subject Attendance Breakdown</h3>
            <Link to="/student/attendance" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Full Log <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {attendanceSummaries.map((sub, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{sub.subject}</span>
                  <span style={{ fontWeight: 700, color: sub.percentage >= 75 ? '#059669' : '#e11d48' }}>
                    {sub.percentage}% ({sub.attendedClasses}/{sub.totalClasses} classes)
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className={`progress-bar-fill ${sub.percentage >= 85 ? 'progress-green' : sub.percentage >= 75 ? 'progress-amber' : 'progress-red'}`}
                    style={{ width: `${Math.min(100, sub.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Academic Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <h3 className="card-title">Academic Profile</h3>
              <span className="badge badge-available">Active</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Roll Number</span>
                <strong style={{ color: '#0f172a' }}>{user?.rollNumber || 'CS2024001'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Department</span>
                <strong style={{ color: '#0f172a' }}>{user?.departmentName || 'Computer Science'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Semester / Batch</span>
                <strong style={{ color: '#0f172a' }}>{user?.semester || 'Semester 6'} ({user?.batch || '2023-2027'})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748b' }}>Current CGPA</span>
                <strong style={{ color: '#059669', fontSize: '1rem' }}>8.85 / 10.0</strong>
              </div>
            </div>
          </div>

          <Link to="/profile" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '1rem' }}>
            View Full Student Dossier
          </Link>
        </div>
      </div>

      {/* Announcements & Campus Events */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Latest Announcements */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={18} style={{ color: '#6366f1' }} />
              <h3 className="card-title">Campus Announcements</h3>
            </div>
            <Link to="/announcements" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5' }}>
              All &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {announcements.map((ann) => (
              <div key={ann.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', borderLeft: ann.priority === 'HIGH' ? '3px solid #f43f5e' : '3px solid #6366f1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e293b' }}>{ann.title}</h4>
                  <StatusBadge status={ann.priority} />
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{ann.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Campus Events */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} style={{ color: '#0ea5e9' }} />
              <h3 className="card-title">Upcoming Campus Events</h3>
            </div>
            <Link to="/events" style={{ fontSize: '0.82rem', fontWeight: 600, color: '#4f46e5' }}>
              Explore &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {events.map((evt) => (
              <div key={evt.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e293b' }}>{evt.eventName}</h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>📅 {evt.eventDate} &bull; 📍 {evt.venue}</p>
                </div>
                <Link to="/events" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
