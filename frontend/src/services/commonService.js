import api from './api';

export const commonService = {
  getAnnouncements: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },

  createAnnouncement: async (announcementData) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },

  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  getEvents: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  },

  getResources: async () => {
    const response = await api.get('/resources');
    return response.data;
  },

  bookResource: async (resourceId, bookingData) => {
    const response = await api.post(`/resources/${resourceId}/book`, bookingData);
    return response.data;
  },

  releaseResource: async (resourceId) => {
    const response = await api.post(`/resources/${resourceId}/release`);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadNotificationsCount: async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  markNotificationAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  }
};
