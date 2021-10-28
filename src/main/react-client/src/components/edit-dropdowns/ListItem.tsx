import React, { FC } from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectedItem, editingItems } from '../../redux/slices/item'
import { IListItem } from '../../schemas'

interface Props {
    item: IListItem
}
const ListItem: FC<Props> = ({ item }) => {
    const { parentId } = useAppSelector((state) => state.item)
    const dispatch = useAppDispatch()

    const handleItemSelection = () => {
        if (parentId && parentId !== undefined) {
            dispatch(editingItems(true))
            dispatch(selectedItem({ parentId, item }))
        }
    }

    return (
        <DropdownItem onClick={handleItemSelection}>{item.name}</DropdownItem>
    )
}

export default ListItem
