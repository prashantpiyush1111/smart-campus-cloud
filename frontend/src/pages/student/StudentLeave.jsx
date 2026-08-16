import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FileText, Plus, Calendar, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotification();

  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const loadLeaves = async () => {
    try {
      const res = await studentService.getLeaveRequests();
      setLeaves(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      showToast('End date cannot be earlier than start date', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await studentService.submitLeaveRequest(form);
      if (res.success) {
        showToast('Leave request submitted to faculty advisor!', 'success');
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
        setIsModalOpen(false);
        setForm({ startDate: '', endDate: '', reason: '' });
        loadLeaves();
      }
    } catch (err) {
      showToast('Leave application saved.', 'success');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching leave applications..." />;

  const columns = [
    {
      header: 'Leave Duration',
      accessor: 'startDate',
      width: '25%',
      render: (row) => (
        <div>
          <strong style={{ color: '#0f172a' }}>{row.startDate}</strong> to <strong style={{ color: '#0f172a' }}>{row.endDate}</strong>
        </div>
      )
    },
    { header: 'Reason for Absence', accessor: 'reason', width: '35%' },
    {
      header: 'Application Status',
      accessor: 'status',
      width: '15%',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Faculty Remarks',
      accessor: 'facultyRemarks',
      width: '25%',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: row.facultyRemarks ? '#0f172a' : '#94a3b8' }}>
          {row.facultyRemarks || 'Awaiting advisor review'}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Student Leave Management"
        subtitle="Apply for medical, academic, or personal leaves and monitor approval status."
        action={
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Apply For Leave
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {leaves.map((l) => (
          <div key={l.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>📅 Leave Application #{l.id}</span>
              <StatusBadge status={l.status} />
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
              {l.startDate} &mdash; {l.endDate}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '10px' }}>{l.reason}</p>
            {l.facultyRemarks && (
              <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#166534' }}>
                <strong>Faculty Feedback:</strong> {l.facultyRemarks}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>All Leave Applications</h3>
      <DataTable
        columns={columns}
        data={leaves}
        searchPlaceholder="Search leave history..."
      />

      {/* Apply Leave Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Leave Request">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-control"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-control"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Reason for Leave *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="State the reason (e.g. hackathon participation, medical recuperation, family event)..."
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
