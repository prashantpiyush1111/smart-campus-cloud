import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Users, Briefcase, Phone, Mail } from 'lucide-react';

export const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const res = await adminService.getFaculty();
        setFaculty(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadFaculty();
  }, []);

  if (loading) return <LoadingSpinner text="Loading faculty directory..." />;

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeCode',
      width: '15%',
      render: (row) => <strong style={{ color: '#4f46e5' }}>{row.employeeCode}</strong>
    },
    {
      header: 'Faculty Name & Email',
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
      header: 'Designation & Dept',
      accessor: 'designation',
      width: '25%',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: '#334155' }}>{row.designation}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.user?.department?.name || 'CSE'}</div>
        </div>
      )
    },
    {
      header: 'Specialization',
      accessor: 'specialization',
      width: '25%',
      render: (row) => <span style={{ fontSize: '0.85rem' }}>{row.specialization || 'Academic Research'}</span>
    },
    {
      header: 'Status',
      accessor: 'active',
      width: '10%',
      render: (row) => (
        <span className={`badge ${row.user?.active ? 'badge-available' : 'badge-absent'}`}>
          {row.user?.active ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Faculty & Academic Staff Directory"
        subtitle="Manage professor appointments, designations, department chairs, and teaching specializations."
      />

      <DataTable
        columns={columns}
        data={faculty}
        searchPlaceholder="Search faculty by employee code, name, or designation..."
      />
    </div>
  );
};
