import React, { FC } from 'react'
import { DropdownItem } from 'reactstrap'

interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: IListItem[]
    setListItemSelection: (listItemSelection: IListItem) => void
}

const ItemListComponentList: FC<Props> = ({
    listItems,
    setListItemSelection,
}) => {
    const listNode = listItems.map((listItem) => (
        <DropdownItem onClick={() => setListItemSelection(listItem)}>
            {listItem.name}
        </DropdownItem>
    ))
    return <>{listNode}</>
}

export default ItemListComponentList
