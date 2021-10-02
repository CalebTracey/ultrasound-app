import React, { FC } from 'react'
import { DropdownMenu } from 'reactstrap'
import ItemListComponentList from './ItemListComponentList'

interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: IListItem[]
    setListItemSelection: (listItemSelection: IListItem) => void
}

const ItemListDropdown: FC<Props> = ({ listItems, setListItemSelection }) => (
    <DropdownMenu
        modifiers={{
            setMaxHeight: {
                enabled: true,
                order: 890,
                fn: (data) => ({
                    ...data,
                    styles: {
                        ...data.styles,
                        overflow: 'auto',
                        maxHeight: '10em',
                    },
                }),
            },
        }}
    >
        <ItemListComponentList
            listItems={listItems}
            setListItemSelection={setListItemSelection}
        />
    </DropdownMenu>
)

export default ItemListDropdown
