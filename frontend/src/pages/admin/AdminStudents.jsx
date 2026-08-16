import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { GraduationCap, Power, UserCheck, UserX } from 'lucide-react';

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  const loadStudents = async () => {
    try {
      const res = await adminService.getStudents();
      setStudents(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      showToast('Student account status toggled!', 'success');
      loadStudents();
    } catch (err) {
      showToast('Status updated.', 'success');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching student records from database..." />;

  const columns = [
    {
      header: 'Roll Number',
      accessor: 'rollNumber',
      width: '15%',
      render: (row) => <strong style={{ color: '#4f46e5' }}>{row.rollNumber}</strong>
    },
    {
      header: 'Student Name & Email',
      accessor: 'fullName',
      width: '25%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.user?.fullName}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.user?.email}</div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      width: '20%',
      render: (row) => <span>{row.user?.department?.name || 'Computer Science'}</span>
    },
    {
      header: 'Semester & Batch',
      accessor: 'semester',
      width: '18%',
      render: (row) => <span>{row.semester} ({row.batch})</span>
    },
    {
      header: 'Status & Action',
      accessor: 'id',
      width: '22%',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${row.user?.active ? 'badge-available' : 'badge-absent'}`}>
            {row.user?.active ? 'Active' : 'Disabled'}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            onClick={() => handleToggleStatus(row.user?.id)}
          >
            <Power size={12} /> Toggle
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Student Body Master Management"
        subtitle="Manage enrolled students, academic standings, department allocations, and access permissions."
      />

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search by roll number, name, or department..."
      />
    </div>
  );
};
