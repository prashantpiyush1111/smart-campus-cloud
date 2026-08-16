import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { AlertCircle, Tag, MapPin } from 'lucide-react';

export const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const res = await adminService.getComplaints();
        setComplaints(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadComplaints();
  }, []);

  if (loading) return <LoadingSpinner text="Loading campus-wide grievances..." />;

  const columns = [
    { header: 'ID', accessor: 'complaintCode', width: '15%' },
    {
      header: 'Student',
      accessor: 'student',
      width: '20%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.student?.user?.fullName || 'Student'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Roll: {row.student?.rollNumber}</div>
        </div>
      )
    },
    {
      header: 'Complaint & Location',
      accessor: 'title',
      width: '30%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#1e293b' }}>{row.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
      header: 'Resolution',
      accessor: 'resolutionRemarks',
      width: '18%',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: row.resolutionRemarks ? '#059669' : '#94a3b8' }}>
          {row.resolutionRemarks || 'Pending'}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Campus Complaints & Grievance Master"
        subtitle="Full oversight of campus facilities maintenance tickets, turnaround metrics, and escalations."
      />

      <DataTable
        columns={columns}
        data={complaints}
        searchPlaceholder="Search complaints across all departments..."
      />
    </div>
  );
};
