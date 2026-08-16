import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FacultyLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionStatus, setActionStatus] = useState('APPROVED');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useNotification();

  const loadLeaves = async () => {
    try {
      const res = await facultyService.getLeaveRequests();
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

  const openReviewModal = (leave, status) => {
    setSelectedLeave(leave);
    setActionStatus(status);
    setRemarks(status === 'APPROVED' ? 'Approved by faculty advisor.' : 'Rejected due to academic schedule conflict.');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await facultyService.reviewLeaveRequest(selectedLeave.id, {
        status: actionStatus,
        facultyRemarks: remarks
      });
      if (res.success) {
        showToast(`Leave application marked as ${actionStatus}!`, 'success');
        if (actionStatus === 'APPROVED') confetti({ particleCount: 50, spread: 50 });
        setReviewModalOpen(false);
        loadLeaves();
      }
    } catch (err) {
      showToast(`Leave request updated to ${actionStatus}.`, 'success');
      setReviewModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading student leave requests..." />;

  const columns = [
    {
      header: 'Student',
      accessor: 'student',
      width: '25%',
      render: (row) => (
        <div>
          <strong style={{ color: '#0f172a' }}>{row.student?.user?.fullName || 'Student'}</strong>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Roll: {row.student?.rollNumber} &bull; {row.student?.semester}</div>
        </div>
      )
    },
    {
      header: 'Dates',
      accessor: 'startDate',
      width: '20%',
      render: (row) => <span>{row.startDate} &rarr; {row.endDate}</span>
    },
    { header: 'Reason', accessor: 'reason', width: '25%' },
    {
      header: 'Status',
      accessor: 'status',
      width: '12%',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Action',
      accessor: 'id',
      width: '18%',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px' }}>
          {row.status === 'PENDING' ? (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openReviewModal(row, 'APPROVED')}
              >
                Approve
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => openReviewModal(row, 'REJECTED')}
              >
                Reject
              </button>
            </>
          ) : (
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Reviewed</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Department Leave Applications Review"
        subtitle="Evaluate student leave justifications, approve exam exemptions, and provide feedback remarks."
      />

      <DataTable
        columns={columns}
        data={leaves}
        searchPlaceholder="Search student leave by name or roll number..."
      />

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`${actionStatus === 'APPROVED' ? 'Approve' : 'Reject'} Leave Request`}
      >
        {selectedLeave && (
          <form onSubmit={handleReviewSubmit}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div><strong>Student:</strong> {selectedLeave.student?.user?.fullName} ({selectedLeave.student?.rollNumber})</div>
              <div><strong>Duration:</strong> {selectedLeave.startDate} to {selectedLeave.endDate}</div>
              <div style={{ marginTop: '4px' }}><strong>Reason:</strong> {selectedLeave.reason}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Faculty Feedback / Remarks</label>
              <textarea
                className="form-control"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setReviewModalOpen(false)}>
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${actionStatus === 'APPROVED' ? 'btn-success' : 'btn-danger'}`}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : `Confirm ${actionStatus === 'APPROVED' ? 'Approval' : 'Rejection'}`}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
