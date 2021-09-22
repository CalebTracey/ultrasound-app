import api from './api';

const getPublicContent = () => api.get(`time`);

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
