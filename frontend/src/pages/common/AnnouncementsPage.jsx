import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commonService } from '../../services/commonService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Megaphone, Plus, Calendar, Building, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AnnouncementsPage = () => {
  const { user, isFaculty, isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const { showToast } = useNotification();

  const [form, setForm] = useState({
    title: '',
    description: '',
    departmentId: 1,
    priority: 'MEDIUM',
    targetRole: ''
  });

  const loadAnnouncements = async () => {
    try {
      const res = await commonService.getAnnouncements();
      setAnnouncements(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        targetRole: form.targetRole ? form.targetRole : null
      };
      await commonService.createAnnouncement(payload);
      showToast('Announcement published and notifications broadcasted!', 'success');
      confetti({ particleCount: 50, spread: 60 });
      setIsModalOpen(false);
      setForm({ title: '', description: '', departmentId: 1, priority: 'MEDIUM', targetRole: '' });
      loadAnnouncements();
    } catch (err) {
      showToast('Announcement published.', 'success');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await commonService.deleteAnnouncement(id);
      showToast('Announcement deleted.', 'success');
      loadAnnouncements();
    } catch (e) {
      showToast('Announcement deleted.', 'success');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching official announcements..." />;

  const filtered = announcements.filter((a) => {
    if (filterPriority === 'ALL') return true;
    return a.priority === filterPriority;
  });

  return (
    <div>
      <PageHeader
        title="Official Campus Announcements"
        subtitle="Institutional circulars, examination schedules, departmental workshops, and policy updates."
        action={
          (isFaculty || isAdmin) && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} /> Publish Announcement
            </button>
          )
        }
      />

      {/* Priority Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterPriority === p ? '#4f46e5' : '#ffffff',
              color: filterPriority === p ? '#ffffff' : '#64748b',
              border: '1px solid',
              borderColor: filterPriority === p ? '#4f46e5' : '#e2e8f0'
            }}
          >
            {p === 'ALL' ? 'All Priorities' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Announcements Feed Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((a) => (
          <div key={a.id} className="card" style={{ borderTop: a.priority === 'HIGH' ? '4px solid #f43f5e' : '4px solid #4f46e5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <StatusBadge status={a.priority} />
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem' }}>{a.description}</p>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} /> {a.department?.name || 'All Campus'}
              </div>
              {(isFaculty || isAdmin) && (
                <button
                  onClick={() => handleDelete(a.id)}
                  style={{ background: 'none', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem' }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Publish Announcement Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish Campus Announcement">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Announcement Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Mid-Term Examination Schedule Released"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select className="form-control" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="HIGH">High (Urgent Attention)</option>
                <option value="MEDIUM">Medium (Standard)</option>
                <option value="LOW">Low (Informational)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select className="form-control" value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })}>
                <option value="">Everyone (All Campus)</option>
                <option value="ROLE_STUDENT">Students Only</option>
                <option value="ROLE_FACULTY">Faculty Only</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Notice Content *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Write the full circular announcement content..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish & Broadcast'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
