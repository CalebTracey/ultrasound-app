import api from './api';

const getPublicContent = () => api.get(`/all`);

const getClassifications = () => api.get('/classifications');

const getAdminContent = () => api.get(`/admin`);

const UserService = {
  getPublicContent,
  getClassifications,
  getAdminContent,
};
export default UserService;
