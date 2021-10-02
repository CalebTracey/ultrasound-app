import api from './api'

const getPublicContent = () => api.get(`time`)

const getClassifications = () => api.get('classifications')

const getAdminContent = () => api.get(`admin`)

const getUrl = (link) => api.get(`S3/link/${link}`)

const getSubMenu = (id) => api.get(`submenu/${id}`)

const UserService = {
    getPublicContent,
    getClassifications,
    getAdminContent,
    getSubMenu,
    getUrl,
}
export default UserService
