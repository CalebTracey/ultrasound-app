/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { FC, useEffect } from 'react'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditListItem from './EditListItem'
import { useAppSelector } from '../../redux/hooks'
import useItems from '../../hooks/useItems'
import { resetItemSelection } from '../../redux/slices/item'

const EditItemListContainer: FC = () => {
    const { size, loading, editing } = useAppSelector((state) => state.item)
    const [response, getItems] = useItems({
        parentId: '',
        list: [],
        isLoading: false,
        error: null,
    })
    const { isLoading } = response
    useEffect(() => {
        const controller = new AbortController()
        if (!isLoading && loading !== 'successful') {
            if (size !== 0) {
                resetItemSelection()
            }
            getItems()
        }
        return () => controller?.abort()
    }, [getItems, isLoading, loading, size])

    return size !== 0 && !isLoading && loading === 'successful' ? (
        <>
            <ItemListDropdownContainer />
            {editing && <EditListItem />}
        </>
    ) : null
}
export default EditItemListContainer
