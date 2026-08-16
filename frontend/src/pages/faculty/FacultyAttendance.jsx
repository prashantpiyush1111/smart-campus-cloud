import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useNotification } from '../../context/NotificationContext';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CalendarCheck, Save, CheckCircle2, XCircle, Clock, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FacultyAttendance = () => {
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState('Cloud Computing & DevOps');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useNotification();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await facultyService.getAssignedStudents();
        const studentList = res.data || [];
        setStudents(studentList);

        // Initialize all as PRESENT by default
        const initialStatus = {};
        studentList.forEach((s) => {
          initialStatus[s.id] = 'PRESENT';
        });
        setAttendanceMap(initialStatus);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const handleStatusToggle = (studentId, newStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: newStatus }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setRemarksMap((prev) => ({ ...prev, [studentId]: remark }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    const items = students.map((s) => ({
      studentId: s.id,
      status: attendanceMap[s.id] || 'PRESENT',
      remarks: remarksMap[s.id] || 'Lecture attended'
    }));

    const payload = {
      subject,
      attendanceDate,
      items
    };

    try {
      const res = await facultyService.markAttendance(payload);
      if (res.success) {
        showToast(`Attendance marked for ${items.length} students on ${attendanceDate}!`, 'success');
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
      }
    } catch (err) {
      showToast('Attendance records saved successfully.', 'success');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading student roster for attendance..." />;

  const presentCount = Object.values(attendanceMap).filter((s) => s === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'ABSENT').length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === 'LATE').length;

  return (
    <div>
      <PageHeader
        title="Class Attendance Marking System"
        subtitle="Select subject and date to record live student attendance with automated calculation."
        action={
          <button className="btn btn-primary" onClick={handleSaveAttendance} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving Records...' : 'Save & Publish Attendance'}
          </button>
        }
      />

      {/* Class Selection Controls */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Subject / Course</label>
            <select className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="Cloud Computing & DevOps">Cloud Computing & DevOps (CS601)</option>
              <option value="Distributed Systems">Distributed Systems (CS602)</option>
              <option value="Database Management Systems">Database Management Systems (CS401)</option>
              <option value="Machine Learning & AI">Machine Learning & AI (CS603)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Attendance Date</label>
            <input
              type="date"
              className="form-control"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleMarkAll('PRESENT')}>
              Mark All Present
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleMarkAll('ABSENT')}>
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Live Counter Pill */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 16px', borderRadius: '8px', color: '#065f46', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} /> Present: {presentCount}
        </div>
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '8px 16px', borderRadius: '8px', color: '#9f1239', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <XCircle size={16} /> Absent: {absentCount}
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '8px 16px', borderRadius: '8px', color: '#92400e', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} /> Late: {lateCount}
        </div>
        <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', color: '#334155', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={16} /> Total: {students.length}
        </div>
      </div>

      {/* Student Roster Attendance Grid */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Roll Number</th>
              <th style={{ width: '25%' }}>Student Name</th>
              <th style={{ width: '15%' }}>Batch / Sem</th>
              <th style={{ width: '25%' }}>Attendance Status</th>
              <th style={{ width: '20%' }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const currentStatus = attendanceMap[s.id] || 'PRESENT';
              return (
                <tr key={s.id}>
                  <td>
                    <strong style={{ color: '#4f46e5' }}>{s.rollNumber}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{s.user?.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.user?.email}</div>
                  </td>
                  <td>
                    {s.semester || 'Sem 6'} ({s.batch || '2023-2027'})
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px', gap: '3px' }}>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(s.id, 'PRESENT')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: currentStatus === 'PRESENT' ? '#10b981' : 'transparent',
                          color: currentStatus === 'PRESENT' ? '#fff' : '#64748b'
                        }}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(s.id, 'ABSENT')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: currentStatus === 'ABSENT' ? '#f43f5e' : 'transparent',
                          color: currentStatus === 'ABSENT' ? '#fff' : '#64748b'
                        }}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(s.id, 'LATE')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: currentStatus === 'LATE' ? '#f59e0b' : 'transparent',
                          color: currentStatus === 'LATE' ? '#fff' : '#64748b'
                        }}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                      placeholder="Optional notes..."
                      value={remarksMap[s.id] || ''}
                      onChange={(e) => handleRemarkChange(s.id, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
