import api from './api';

export const enrollmentService = {
  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my');
    return response.data;
  },

  getCourseStudents: async (courseId) => {
    const response = await api.get(`/courses/${courseId}/students`);
    return response.data;
  }
};
