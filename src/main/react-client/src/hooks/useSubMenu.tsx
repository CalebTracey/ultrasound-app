import { useCallback, useState } from 'react'
import { unwrapResult } from '@reduxjs/toolkit'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { ISubMenuObj } from '../schemas'
import { selectedSubMenu, getOne } from '../redux/slices/subMenu'
import { newError } from '../redux/slices/message'

interface Props {
    id: string
    subMenuObj: ISubMenuObj | Record<string, unknown>
    isLoading: boolean
    error: null
}
const useSubMenu = (props: Props): [Props, () => void] => {
    const { id, subMenuObj, isLoading, error } = props
    const itemListState = useAppSelector((state) => state.item.listMap)
    const loadingItem = useAppSelector((state) => state.item.loading)
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
        const controller = new AbortController()

        setResponse((prevState) => ({ ...prevState, isLoading: true }))
        const subMenuCurrent: ISubMenuObj = itemListState[id]
        if (isSubMenuObj(subMenuCurrent) && loadingItem === 'idle') {
            dispatch(selectedSubMenu(subMenuCurrent))
                .then((res) => {
                    if (loadingState === 'successful')
                        setResponse({
                            id,
                            subMenuObj: res,
                            isLoading: false,
                            error: null,
                        })
                })
                .catch((err: Error) => {
                    dispatch(newError(err.message))
                    return Promise.reject(err.message)
                })
        } else {
            dispatch(getOne(id))
                .then(unwrapResult)
                .then((res: ISubMenuObj) => {
                    const subMenuFetched: ISubMenuObj = res
                    if (
                        subMenuFetched !== undefined &&
                        isSubMenuObj(subMenuFetched)
                    ) {
                        setResponse({
                            id,
                            subMenuObj: subMenuFetched,
                            isLoading: false,
                            error: null,
                        })
                    }
                })
                .catch((err: Error) => {
                    dispatch(newError(err.message))
                    return Promise.reject(err.message)
                })
        }
        return () => controller?.abort()
    }, [id, dispatch, itemListState, loadingState, loadingItem])

    return [response, getSubMenu]
}

export default useSubMenu
