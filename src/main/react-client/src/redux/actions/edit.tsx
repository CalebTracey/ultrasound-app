import { PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import api from '../../service/api'
import { TDispatch, RootState } from '../store'
import { SET_MESSAGE } from './types'

type TPromise = Promise<string | Error>

type TAction = PayloadAction<string>

interface IDataNameProps {
    id: string
    textValue: string
    type: string
}

const dataName =
    (props: IDataNameProps): ThunkAction<TPromise, RootState, any, TAction> =>
    (dispatch: TDispatch): TPromise => {
        const { id, textValue, type } = props
        const newName = { name: textValue }
        return api
            .post(`/edit/${type}/name/${id}`, newName)
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
                    payload: error,
                })
                return Promise.reject(error)
            })
    }

const edit = { dataName }

export default edit
