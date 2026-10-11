import api from './api';

export const gradeService = {
  gradeSubmission: async (submissionId, marksAwarded, feedback) => {
    const response = await api.post(`/submissions/${submissionId}/grade`, { marksAwarded, feedback });
    return response.data;
  },

  getMyGradebook: async () => {
    const response = await api.get('/grades/my');
    return response.data;
  },

  getCourseGradebook: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/gradebook`);
    return response.data;
  }
};
