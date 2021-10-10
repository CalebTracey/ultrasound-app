/* eslint-disable no-underscore-dangle */
import { useState, useCallback } from 'react'
import { useHistory } from 'react-router'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { IListItem } from '../schemas'
import { selectedItemList } from '../redux/slices/item'
import { newError } from '../redux/slices/message'
// import history from '../helpers/history'

interface Props {
    parentId: string
    list: IListItem[] | Record<string, unknown>
    isLoading: boolean
    error: null
}

const useItems = (props: Props): [Props, () => void] => {
    const { list, parentId, isLoading, error } = props
    //  SubMenu State
    const { subMenu } = useAppSelector((state) => state)
    const { loading } = useAppSelector((state) => state.item)
    // Classification State
    const { classification } = useAppSelector((state) => state)
    const [response, setResponse] = useState({
        parentId,
        list,
        isLoading,
        error,
    })
    const isClassificationEditing = classification.editing
    const isSubMenuEditing = subMenu.editing
    const classificationItems = classification.selected.listItems
    const subMenuItems = subMenu.itemList
    const dispatch = useAppDispatch()
    const isItemList = (value: unknown): value is IListItem[] => {
        return !!value && !!(value as IListItem[])
    }

    const getItems = useCallback(() => {
        const controller = new AbortController()

        const dispatchSelection = async (
            id: string,
            listSelection: IListItem[],
            selectionType: 'classification' | 'subMenu'
        ) => {
            await dispatch(
                selectedItemList({
                    parentId: id,
                    list: listSelection,
                    itemType: selectionType,
                })
                // ).catch((err) => {
                //     // history.push('/dashboard')
                //     dispatch(newError(err))
                //     return Promise.reject(err)
                // })
            )
        }
        setResponse((prevState) => ({ ...prevState, isLoading: false }))
        if (
            isSubMenuEditing &&
            isItemList(subMenuItems) &&
            subMenu.loading !== 'successful'
        ) {
            dispatchSelection(
                subMenu.selected._id,
                subMenuItems,
                'subMenu'
            ).then(() => {
                setResponse({
                    parentId: subMenu.selected._id,
                    list: subMenuItems,
                    isLoading: false,
                    error: null,
                })
            })
            // .catch((err) => {
            //     dispatch(newError(err))
            // })
        } else if (
            isClassificationEditing &&
            isItemList(classificationItems) &&
            loading !== 'successful'
        ) {
            dispatchSelection(
                classification.selected._id,
                classificationItems,
                'classification'
            ).then(() => {
                setResponse({
                    parentId: classification.selected._id,
                    list: classificationItems,
                    isLoading: false,
                    error: null,
                })
            })
            // .catch((err) => {
            //     dispatch(newError(err))
            //     return Promise.reject(err)
            // })
        }
        return () => controller?.abort()
    }, [
        classification,
        subMenu,
        isSubMenuEditing,
        isClassificationEditing,
        classificationItems,
        subMenuItems,
        dispatch,
        loading,
    ])
    return [response, getItems]
}

export default useItems
