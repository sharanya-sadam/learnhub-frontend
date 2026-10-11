import api from './api';

export const submissionService = {
  submitAssignment: async (assignmentId, data) => {
    const response = await api.post(`/assignments/${assignmentId}/submissions`, data);
    return response.data;
  },

  getMySubmission: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/my-submission`);
    return response.data;
  },

  getAssignmentSubmissions: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  getSubmissionById: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}`);
    return response.data;
  }
};
