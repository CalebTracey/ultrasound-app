import React, { FC } from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { selectedItem } from '../../redux/slices/item'
import { IListItem } from '../../schemas'

const ItemListComponentList: FC = () => {
    const { itemList, parentId } = useAppSelector((state) => state.item)
    const dispatch = useAppDispatch()
    const handleItemSelection = (item: IListItem) => {
        if (parentId !== undefined) {
            dispatch(selectedItem({ parentId, item }))
        }
    }
    const listNode =
        itemList !== undefined ? (
            (itemList as IListItem[]).map((listItem: IListItem) => (
                <DropdownItem onClick={() => handleItemSelection(listItem)}>
                    {listItem.name}
                </DropdownItem>
            ))
        ) : (
            <>Loading ...</>
        )
    return <>{listNode}</>
}

export default ItemListComponentList
