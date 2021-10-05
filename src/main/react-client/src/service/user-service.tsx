import { AxiosResponse } from 'axios'
import { api } from './api'
import { IClassification, ISubMenuObj } from '../schemas'

type TSMResponse = { data: ISubMenuObj }
const getPublicContent = () => api.get(`time`)

const getClassifications = (): Promise<IClassification[]> => {
    const response = api.get('classifications').then((res) => {
        return Promise.resolve(res.data)
    })
    return response
}

const getAdminContent = () => api.get(`admin`)

const getUrl = (link: string): Promise<string> => {
    const response = api.get(`S3/link/${link}`).then((res) => {
        return Promise.resolve(res.data)
    })
    return response
}

const getSubMenu = (id: string): Promise<ISubMenuObj> => {
    const response = api
        .get<string, TSMResponse>(`submenu/${id}`)
        .then((res) => {
            return Promise.resolve(res.data)
        })
    return response
}

const UserService = {
    getClassifications,
    getPublicContent,
    getAdminContent,
    getSubMenu,
    getUrl,
}
export default UserService
