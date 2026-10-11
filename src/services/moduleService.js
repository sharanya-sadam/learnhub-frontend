import api from './api';

export const moduleService = {
  getModulesByCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/modules`);
    return response.data;
  },

  createModule: async (courseId, moduleData) => {
    const response = await api.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },

  updateModule: async (moduleId, moduleData) => {
    const response = await api.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  },

  deleteModule: async (moduleId) => {
    const response = await api.delete(`/modules/${moduleId}`);
    return response.data;
  }
};
