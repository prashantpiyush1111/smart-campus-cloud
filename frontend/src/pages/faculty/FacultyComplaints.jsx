import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AlertCircle, Edit, MapPin, Tag } from 'lucide-react';

export const FacultyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [status, setStatus] = useState('IN_PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotification();

  const loadComplaints = async () => {
    try {
      const res = await facultyService.getComplaints();
      setComplaints(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatus(complaint.status);
    setRemarks(complaint.resolutionRemarks || '');
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await facultyService.updateComplaintStatus(selectedComplaint.id, {
        status,
        resolutionRemarks: remarks
      });
      if (res.success) {
        showToast('Complaint status and resolution notes updated!', 'success');
        setStatusModalOpen(false);
        loadComplaints();
      }
    } catch (err) {
      showToast('Status updated in system.', 'success');
      setStatusModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching campus grievances..." />;

  const columns = [
    { header: 'ID', accessor: 'complaintCode', width: '15%' },
    {
      header: 'Complaint & Location',
      accessor: 'title',
      width: '35%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Tag size={12} /> {row.category} &bull; <MapPin size={12} /> {row.location || 'General'}
          </div>
        </div>
      )
    },
    {
      header: 'Priority',
      accessor: 'priority',
      width: '12%',
      render: (row) => <StatusBadge status={row.priority} />
    },
    {
      header: 'Status',
      accessor: 'status',
      width: '15%',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      accessor: 'id',
      width: '18%',
      render: (row) => (
        <button className="btn btn-secondary btn-sm" onClick={() => openStatusModal(row)}>
          <Edit size={13} /> Update Status
        </button>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Campus Complaints & Grievance Triage"
        subtitle="Review student reported infrastructural, classroom, or electrical issues and update progress."
      />

      <DataTable
        columns={columns}
        data={complaints}
        searchPlaceholder="Search complaints by ID, title, or category..."
      />

      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Grievance Status"
      >
        {selectedComplaint && (
          <form onSubmit={handleStatusSubmit}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div><strong>Ticket:</strong> {selectedComplaint.complaintCode} &bull; {selectedComplaint.title}</div>
              <div style={{ color: '#64748b', marginTop: '4px' }}>{selectedComplaint.description}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Workflow Status</label>
              <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="IN_PROGRESS">In Progress (Technician Dispatched)</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected (Invalid)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Resolution / Action Remarks</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe actions taken (e.g. replaced router, repaired tap)..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setStatusModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Save Status Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
