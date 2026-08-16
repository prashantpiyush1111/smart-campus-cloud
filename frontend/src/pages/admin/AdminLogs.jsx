import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { History, Shield, Globe, Terminal } from 'lucide-react';

export const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const res = await adminService.getActivityLogs();
        setLogs(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  if (loading) return <LoadingSpinner text="Loading security audit trail..." />;

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      width: '20%',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {row.timestamp ? new Date(row.timestamp).toLocaleString() : 'Recent'}
        </span>
      )
    },
    {
      header: 'User Email',
      accessor: 'userEmail',
      width: '22%',
      render: (row) => <strong style={{ color: '#0f172a' }}>{row.userEmail}</strong>
    },
    {
      header: 'Action / Event',
      accessor: 'action',
      width: '20%',
      render: (row) => (
        <span
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            fontFamily: 'monospace',
            color: '#334155'
          }}
        >
          {row.action}
        </span>
      )
    },
    { header: 'Event Details', accessor: 'details', width: '25%' },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      width: '13%',
      render: (row) => (
        <span style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'monospace' }}>
          {row.ipAddress || '127.0.0.1'}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Security & System Activity Audit Logs"
        subtitle="Immutable audit trail of authentication events, grievance transitions, and attendance records."
      />

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit logs by email, action, or details..."
      />
    </div>
  );
};
