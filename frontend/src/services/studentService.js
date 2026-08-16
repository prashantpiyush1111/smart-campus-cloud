import api from './api';

export const studentService = {
  getDashboard: async () => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  getAttendanceSummary: async () => {
    const response = await api.get('/students/attendance');
    return response.data;
  },

  getAttendanceHistory: async () => {
    const response = await api.get('/students/attendance/history');
    return response.data;
  },

  getComplaints: async () => {
    const response = await api.get('/students/complaints');
    return response.data;
  },

  submitComplaint: async (complaintData) => {
    const response = await api.post('/students/complaints', complaintData);
    return response.data;
  },

  getLeaveRequests: async () => {
    const response = await api.get('/students/leave');
    return response.data;
  },

  submitLeaveRequest: async (leaveData) => {
    const response = await api.post('/students/leave', leaveData);
    return response.data;
  }
};
