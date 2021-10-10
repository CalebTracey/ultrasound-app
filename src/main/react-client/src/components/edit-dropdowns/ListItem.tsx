import React, { FC, useCallback } from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectedItem, editingItems, getLinkUrl } from '../../redux/slices/item'
import { IListItem } from '../../schemas'

interface Props {
    item: IListItem
}
const ListItem: FC<Props> = ({ item }) => {
    const { itemList, parentId, size, loading } = useAppSelector(
        (state) => state.item
    )
    const dispatch = useAppDispatch()

    // const handleItemSelection = useCallback(
    //     (item: IListItem) => {
    //         if (parentId !== undefined) {
    //             dispatch(selectedItem({ parentId, item }))
    //             // dispatch(editingItems())
    //         }
    //     },
    //     [dispatch, parentId]
    // )
    const handleItemSelection = () => {
        console.log(parentId)
        if (loading === 'successful' && parentId && parentId !== undefined) {
            console.log('item select')
            dispatch(editingItems(true))
            dispatch(selectedItem({ parentId, item }))
        }
    }

    return (
        <DropdownItem onClick={handleItemSelection}>{item.name}</DropdownItem>
    )
}

export default ListItem
