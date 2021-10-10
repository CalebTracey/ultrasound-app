import React, { FC, useCallback } from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectedItem, editingItems } from '../../redux/slices/item'
import { IListItem } from '../../schemas'
import ListItem from './ListItem'

const ItemListComponentList: FC = () => {
    const { itemList, parentId, size, loading } = useAppSelector(
        (state) => state.item
    )
    // const dispatch = useAppDispatch()

    // const handleItemSelection = useCallback(
    //     (item: IListItem) => {
    //         if (parentId !== undefined) {
    //             dispatch(selectedItem({ parentId, item }))
    //             // dispatch(editingItems())
    //         }
    //     },
    //     [dispatch, parentId]
    // )
    // const handleItemSelection = async (e: MouseEvent) => {
    //     e.preventDefault()
    //     if (!isLoading) {
    //         getSubMenu()
    //         dispatch(editingSubMenu(true))
    //     }
    // }
    // <DropdownItem onClick={() => handleItemSelection(listItem)}>
    //             {listItem.name}
    //         </DropdownItem>
    const listNode =
        size !== 0 &&
        loading === 'successful' &&
        (itemList as IListItem[]).map((listItem: IListItem) => {
            return <ListItem item={listItem} />
        })

    return <>{listNode}</>
}
export default ItemListComponentList
