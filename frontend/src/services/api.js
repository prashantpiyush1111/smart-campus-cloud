import axios from 'axios';
import * as MockData from './mockData';

// Access tokens live only in memory so XSS cannot read them from persistent browser storage.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with graceful mock fallback for standalone presentation mode
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is offline or network error occurs, serve mock data gracefully
    if (!error.response || error.code === 'ERR_NETWORK' || error.response.status === 404 || error.response.status === 502) {
      console.warn('[Smart Campus] Backend unreachable, using fallback mock response for URL:', error.config?.url);
      const url = error.config?.url || '';

      if (url.includes('/auth/login')) {
        const data = JSON.parse(error.config.data || '{}');
        let user = MockData.mockUsers.student;
        if (data.email?.includes('admin')) user = MockData.mockUsers.admin;
        else if (data.email?.includes('faculty')) user = MockData.mockUsers.faculty;
        return Promise.resolve({ data: { success: true, message: 'Mock Login Successful', data: user } });
      }

      if (url.includes('/students/dashboard')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              overallAttendancePercentage: 93.1,
              totalComplaintsSubmitted: MockData.mockComplaints.length,
              totalLeavesSubmitted: MockData.mockLeaveRequests.length,
              unreadNotificationsCount: 2
            }
          }
        });
      }

      if (url.includes('/students/attendance/history')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockAttendanceHistory } });
      }

      if (url.includes('/students/attendance')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockAttendanceSummary } });
      }

      if (url.includes('/students/complaints') || url.includes('/complaints')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockComplaints } });
      }

      if (url.includes('/students/leave') || url.includes('/leave-requests')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockLeaveRequests } });
      }

      if (url.includes('/announcements')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockAnnouncements } });
      }

      if (url.includes('/events')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockEvents } });
      }

      if (url.includes('/resources')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockResources } });
      }

      if (url.includes('/notifications/unread/count')) {
        return Promise.resolve({ data: { success: true, data: { unreadCount: 2 } } });
      }

      if (url.includes('/notifications')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockNotifications } });
      }

      if (url.includes('/admin/dashboard') || url.includes('/faculty/dashboard')) {
        return Promise.resolve({
          data: {
            success: true,
            data: {
              totalStudents: 120,
              totalFaculty: 18,
              totalDepartments: 4,
              activeComplaints: 2,
              resolvedComplaints: 14,
              pendingLeaves: 1,
              totalResources: 5,
              availableResources: 3,
              upcomingEvents: 3,
              totalAnnouncements: 3,
              assignedStudentsCount: 45,
              facultyPendingLeaves: 1,
              departmentComplaints: 2,
              complaintsByCategory: { INTERNET: 4, CLASSROOM: 3, WATER: 2, ELECTRICAL: 5 },
              complaintsByStatus: { SUBMITTED: 1, UNDER_REVIEW: 1, IN_PROGRESS: 1, RESOLVED: 14 },
              usersByDepartment: { CSE: 65, ECE: 40, MECH: 25, IT: 20 }
            }
          }
        });
      }

      if (url.includes('/admin/students') || url.includes('/faculty/students')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockStudentsList } });
      }

      if (url.includes('/admin/faculty')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockFacultyList } });
      }

      if (url.includes('/admin/logs')) {
        return Promise.resolve({ data: { success: true, data: MockData.mockActivityLogs } });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
