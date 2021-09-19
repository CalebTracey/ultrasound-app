import api from './api';

const getPublicContent = () => api.get(`all`);

const getClassifications = () => api.get('classifications');

const getAdminContent = () => api.get(`admin`);

const getSubMenu = (id) => api.get(`submenu/${id}`);

const UserService = {
  getSubMenu,
  getPublicContent,
  getClassifications,
  getAdminContent,
};
export default UserService;
