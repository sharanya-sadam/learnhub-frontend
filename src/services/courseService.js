import api from './api';

export const courseService = {
  getCourses: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/courses/categories');
    return response.data;
  },

  getCourseDetails: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  getMyTeachingCourses: async () => {
    const response = await api.get('/courses/my-teaching');
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  setPublishStatus: async (id, published) => {
    const response = await api.patch(`/courses/${id}/publish`, null, { params: { published } });
    return response.data;
  }
};
