import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const AdminLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const res = await adminService.getLeaveRequests();
        setLeaves(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLeaves();
  }, []);

  if (loading) return <LoadingSpinner text="Loading leave audit trail..." />;

  const columns = [
    {
      header: 'Student Info',
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
      header: 'Duration',
      accessor: 'startDate',
      width: '20%',
      render: (row) => <span>{row.startDate} &rarr; {row.endDate}</span>
    },
    { header: 'Reason', accessor: 'reason', width: '25%' },
    {
      header: 'Status',
      accessor: 'status',
      width: '15%',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Reviewing Advisor',
      accessor: 'reviewedBy',
      width: '15%',
      render: (row) => (
        <span style={{ fontSize: '0.82rem', color: row.reviewedBy ? '#0f172a' : '#94a3b8' }}>
          {row.reviewedBy?.fullName || 'Pending Review'}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Institutional Leave Requests Audit"
        subtitle="College-wide log of student leave applications, advisor verdicts, and compliance records."
      />

      <DataTable
        columns={columns}
        data={leaves}
        searchPlaceholder="Search leave requests by student or roll number..."
      />
    </div>
  );
};
