/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { FC, useEffect } from 'react'
import EditListItem from './EditListItem'
import { useAppSelector } from '../../redux/hooks'
import useItems from '../../hooks/useItems'
import { resetItemSelection } from '../../redux/slices/item'

const EditItemListContainer: FC = (): JSX.Element | null => {
    const { size, loading, editing } = useAppSelector((state) => state.item)
    const { subMenu, classification } = useAppSelector((state) => state)
    const [response, getItems] = useItems({
        parentId: '',
        list: [],
        isLoading: false,
        error: null,
    })
    const { isLoading } = response
    useEffect(() => {
        const controller = new AbortController()
        if (
            (subMenu.loading === 'successful' ||
                classification.loading !== 'successful') &&
            !isLoading &&
            loading === 'idle'
        ) {
            if (size !== 0) {
                resetItemSelection()
            }
            getItems()
        }
        return () => controller?.abort()
    }, [getItems, isLoading, loading, size, classification, subMenu])

    return size !== 0 && loading === 'successful' && editing ? (
        <EditListItem />
    ) : null
}
export default EditItemListContainer
