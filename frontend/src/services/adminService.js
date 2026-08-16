import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  getFaculty: async () => {
    const response = await api.get('/admin/faculty');
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/admin/departments');
    return response.data;
  },

  createDepartment: async (deptData) => {
    const response = await api.post('/admin/departments', deptData);
    return response.data;
  },

  getComplaints: async () => {
    const response = await api.get('/admin/complaints');
    return response.data;
  },

  getLeaveRequests: async () => {
    const response = await api.get('/admin/leave-requests');
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  getActivityLogs: async () => {
    const response = await api.get('/admin/logs');
    return response.data;
  }
};
