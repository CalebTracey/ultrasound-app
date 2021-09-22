import api from './api';

const upload = (file) => {
  const formData = new FormData();

  formData.append('File', file);

  return api.post('upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const uploadService = (incomingData) => {
  const formData = new FormData();
  formData.append('file', incomingData.files[0]);

  // const file = incomingData.files[0];
  const params = {
    data: {
      category: incomingData.details.category,
      classification: incomingData.details.classification,
      superCategory: incomingData.details?.superCategory,
      subCategory: incomingData.details?.subCategory,
    },
  };

  return api.post('upload', formData, params.data);
};

const getFiles = () => api.get('files');

const getFile = async (id) => Promise.resolve(api.get(`file/${id}`));

const UploadService = {
  uploadService,
  getFile,
  upload,
  getFiles,
};

export default UploadService;
