import { useCallback, useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ISubMenuObj } from '../schemas'
import { selectedSubMenu, getOne } from '../redux/slices/subMenu'
import { newError } from '../redux/slices/message'
import eventBus from '../common/EventBus'

interface Props {
    id: string
    subMenuObj: ISubMenuObj | Record<string, unknown>
    isLoading: boolean
    error: null
}
const useSubMenu = (props: Props): [Props, () => void] => {
    const { id, subMenuObj, isLoading, error } = props
    const subMenuListState = useAppSelector(
        (state) => state.subMenu.subMenuList
    )
    // const loadingItem = useAppSelector((state) => state.item.loading)
    const loadingState = useAppSelector((state) => state.subMenu.loading)
    const dispatch = useAppDispatch()
    const [response, setResponse] = useState({
        id,
        subMenuObj,
        isLoading,
        error,
    })

    const isSubMenuObj = (value: unknown): value is ISubMenuObj => {
        return !!value && !!(value as ISubMenuObj)
    }

    const getSubMenu = useCallback(() => {
        const ac = new AbortController()

        setResponse((prevState) => ({ ...prevState, isLoading: true }))
        const subMenuCurrent: ISubMenuObj = subMenuListState[id]
        if (isSubMenuObj(subMenuCurrent) && loadingState !== 'pending') {
            dispatch(selectedSubMenu(subMenuCurrent))
                .then((res) => {
                    if (loadingState === 'successful') {
                        setResponse({
                            id,
                            subMenuObj: res,
                            isLoading: false,
                            error: null,
                        })
                        eventBus.dispatch('updateItems')
                    }
                })
                .catch((err: Error) => {
                    dispatch(newError(err.message))
                    return Promise.reject(err.message)
                })
        } else if (loadingState !== 'pending') {
            dispatch(getOne(id))
                .then(unwrapResult)
                .then((res: ISubMenuObj) => {
                    // const subMenuFetched: ISubMenuObj = res
                    if (res !== undefined && isSubMenuObj(res)) {
                        setResponse({
                            id,
                            subMenuObj: res,
                            isLoading: false,
                            error: null,
                        })
                        eventBus.dispatch('updateItems')
                    }
                })
                .catch((err: Error) => {
                    dispatch(newError(err.message))
                    return Promise.reject(err.message)
                })
        }

        return () => ac.abort()
    }, [id, dispatch, subMenuListState, loadingState])

    return [response, getSubMenu]
}

export default useSubMenu
