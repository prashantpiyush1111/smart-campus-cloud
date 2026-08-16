import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { GraduationCap, Mail, Phone, UserCheck } from 'lucide-react';

export const FacultyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await facultyService.getAssignedStudents();
        setStudents(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  if (loading) return <LoadingSpinner text="Loading assigned student roster..." />;

  const columns = [
    {
      header: 'Roll Number',
      accessor: 'rollNumber',
      width: '15%',
      render: (row) => <strong style={{ color: '#4f46e5' }}>{row.rollNumber}</strong>
    },
    {
      header: 'Student Name',
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
      header: 'Semester / Batch',
      accessor: 'semester',
      width: '18%',
      render: (row) => <span>{row.semester} ({row.batch})</span>
    },
    {
      header: 'CGPA',
      accessor: 'cgpa',
      width: '12%',
      render: (row) => <strong style={{ color: '#059669' }}>{row.cgpa ? row.cgpa.toFixed(2) : '8.50'}</strong>
    },
    {
      header: 'Guardian Info',
      accessor: 'guardianName',
      width: '30%',
      render: (row) => (
        <div style={{ fontSize: '0.82rem' }}>
          <div>{row.guardianName || 'N/A'}</div>
          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{row.guardianContact || 'N/A'}</div>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Department Student Directory"
        subtitle="Full roster of assigned students, academic standing, and guardian contact details."
      />

      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search students by roll number, name, or email..."
      />
    </div>
  );
};
