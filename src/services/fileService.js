import api from './api';

export const fileService = {
  uploadFile: async (file, category = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
