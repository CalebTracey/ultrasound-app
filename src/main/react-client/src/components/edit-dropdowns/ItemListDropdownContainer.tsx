import React, { FC, useState } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'

interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: IListItem[]
    setListItemSelection: (listItemSelection: IListItem) => void
}

const ItemListDropdownContainer: FC<Props> = ({
    listItems,
    setListItemSelection,
}) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)
    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            disabled={!listItems}
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {`List Items: ${listItems.length}`}
            </DropdownToggle>
            <ItemListDropdown
                setListItemSelection={setListItemSelection}
                listItems={listItems}
            />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
