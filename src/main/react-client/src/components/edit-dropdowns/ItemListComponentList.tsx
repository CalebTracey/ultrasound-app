import React from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import { selectedItem } from '../../redux/slices/item'

interface IListItem {
    name: string
    title: string
    link: string
}

const ItemListComponentList = (): JSX.Element => {
    const { entities } = useAppSelector((state) => state.item)
    const handleItemSelection = (item: IListItem) => {
        selectedItem(item)
    }
    const listNode =
        entities !== undefined ? (
            (entities as IListItem[]).map((listItem: IListItem) => (
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
