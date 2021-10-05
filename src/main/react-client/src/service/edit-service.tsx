import React, { FC } from 'react'
import { api } from './api'

// interface IAxiosResponse extends AxiosResponse {
//     type: string
//     data: string
//     status
//     statusText
//     headers
//     config
// }

interface IDataNameProps {
    id: string
    textValue: string
    type: string
}

interface IDeleteProps {
    id: string
    type: string
}

// const editDataName = async (props: IDataNameProps): Promise<string> => {
//     const { id, textValue, type } = props
//     const newName = { name: textValue }
//     const { data } = await api.post(`/edit/${type}/name/${id}`, newName)
//     return data
// }

// const deleteData = async (props: IDeleteProps): Promise<string> => {
//     const { id, type } = props
//     const { data } = await api.post(`/delete/${type}/${id}`)
//     return data
// }
const DataService = 0
// { editDataName, deleteData }

export default DataService
