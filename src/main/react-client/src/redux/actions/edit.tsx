import { PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import api from '../../service/api'
import { TDispatch, RootState } from '../store'
import { SET_MESSAGE, SET_CLASSIFICATIONS } from './types'
import UserService from '../../service/user-service'
import EventBus from '../../common/EventBus'

const { getClassifications } = UserService

type TPromise = Promise<string | Error>
type TAction = PayloadAction<string>

interface IListItem {
    name: string
    title: string
    link: string
}
interface ISubMenu {
    key: string
    value: string
}
interface IClassification {
    _id: string
    name: string
    hasSubMenu: boolean
    listItems: IListItem[]
    subMenus: { [key: string]: ISubMenu }
}
interface IDataNameProps {
    id: string
    textValue: string
    type: string
}
interface IItemNameProps {
    id: string
    link: string
    textValue: string
    type: string
    currentName: string
}

const dataName =
    (props: IDataNameProps): ThunkAction<TPromise, RootState, any, TAction> =>
    (dispatch: TDispatch): TPromise => {
        const { id, textValue, type } = props
        const newName = { name: textValue }
        return api
            .post(`/edit/${type}/name/${id}`, newName)
            .then((results: { data: string }): Promise<string> => {
                EventBus.dispatch('data')
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

const itemName =
    (props: IItemNameProps): ThunkAction<TPromise, RootState, any, TAction> =>
    (dispatch: TDispatch): TPromise => {
        const { id, link, textValue, type, currentName } = props
        const newItemName = { newName: textValue, link, name: currentName }
        return api
            .post(`/edit/${type}/item/name/${id}`, newItemName)
            .then((results: { data: string }): Promise<string> => {
                EventBus.dispatch('data')
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

const update =
    (): ThunkAction<TPromise, RootState, any, TAction> =>
    (dispatch: TDispatch): TPromise => {
        getClassifications()
            .then(
                (results: {
                    data: IClassification[]
                }): Promise<IClassification[]> => {
                    dispatch({
                        type: SET_CLASSIFICATIONS,
                        payload: results.data,
                    })
                    return Promise.resolve(results.data)
                }
            )
            .catch((error: Error): Promise<Error> => {
                dispatch({
                    type: SET_MESSAGE,
                    payload: error.message,
                })
                return Promise.reject(error)
            })
        return Promise.resolve('Updated data')
    }

const edit = { dataName, itemName, update }

export default edit
