import api from './api';

export const lessonService = {
  getLessonsByModule: async (moduleId) => {
    const response = await api.get(`/modules/${moduleId}/lessons`);
    return response.data;
  },

  getLessonById: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  createLesson: async (moduleId, lessonData) => {
    const response = await api.post(`/modules/${moduleId}/lessons`, lessonData);
    return response.data;
  },

  updateLesson: async (lessonId, lessonData) => {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  deleteLesson: async (lessonId) => {
    const response = await api.delete(`/lessons/${lessonId}`);
    return response.data;
  },

  toggleComplete: async (lessonId) => {
    const response = await api.post(`/lessons/${lessonId}/complete`);
    return response.data;
  }
};
