import { PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import api from '../../service/api'
import { TDispatch, RootState } from '../store'
import { SET_MESSAGE } from './types'

type TPromise = Promise<string | Error>
type TAction = PayloadAction<string>

interface IDeleteDataProps {
    id: string
    type: string
}
interface IDeleteItemProps {
    parentId: string
    parentType: string
    name: string
    link: string
}

const deleteData =
    (props: IDeleteDataProps): ThunkAction<TPromise, RootState, any, TAction> =>
    (dispatch: TDispatch): TPromise => {
        const { id, type } = props
        return api
            .delete(`/delete-data/${type}/${id}`)
            .then((results: { data: string }): Promise<string> => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: results.data,
                })
                return Promise.resolve(results.data)
            })
            .catch((error: Error): Promise<Error> => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: error.message,
                })
                return Promise.reject(error)
            })
    }

const deleteItem =
    (props: IDeleteItemProps): ThunkAction<TPromise, RootState, any, TAction> =>
    (dispatch: TDispatch): TPromise => {
        const { parentId, parentType, name, link } = props
        const itemDetails = { name, link }
        return api
            .post(`/delete-item/${parentType}/${parentId}`, itemDetails)
            .then((results: { data: string }): Promise<string> => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: results.data,
                })
                return Promise.resolve(results.data)
            })
            .catch((error: Error): Promise<Error> => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: error.message,
                })
                return Promise.reject(error)
            })
    }
const remove = { deleteData, deleteItem }

export default remove
