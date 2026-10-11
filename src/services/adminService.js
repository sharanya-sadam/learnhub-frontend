import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  setUserStatus: async (id, active) => {
    const response = await api.patch(`/admin/users/${id}/status`, null, { params: { active } });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getAllCourses: async (params = {}) => {
    const response = await api.get('/admin/courses', { params });
    return response.data;
  },

  getAllEnrollments: async () => {
    const response = await api.get('/admin/enrollments');
    return response.data;
  }
};
