import api from './api';

export const facultyService = {
  getDashboard: async () => {
    const response = await api.get('/faculty/dashboard');
    return response.data;
  },

  getAssignedStudents: async () => {
    const response = await api.get('/faculty/students');
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post('/faculty/attendance', attendanceData);
    return response.data;
  },

  getLeaveRequests: async () => {
    const response = await api.get('/faculty/leave-requests');
    return response.data;
  },

  reviewLeaveRequest: async (id, reviewData) => {
    const response = await api.put(`/faculty/leave-requests/${id}`, reviewData);
    return response.data;
  },

  getComplaints: async () => {
    const response = await api.get('/faculty/complaints');
    return response.data;
  },

  updateComplaintStatus: async (id, statusData) => {
    const response = await api.put(`/faculty/complaints/${id}`, statusData);
    return response.data;
  }
};
