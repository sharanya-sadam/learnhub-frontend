import api from './api';

export const assignmentService = {
  getCourseAssignments: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/assignments`);
    return response.data;
  },

  getAssignmentById: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}`);
    return response.data;
  },

  createAssignment: async (courseId, data) => {
    const response = await api.post(`/courses/${courseId}/assignments`, data);
    return response.data;
  },

  updateAssignment: async (assignmentId, data) => {
    const response = await api.put(`/assignments/${assignmentId}`, data);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/assignments/${assignmentId}`);
    return response.data;
  }
};
