import React, { useState, useReducer } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'
import { useAppSelector } from '../../redux/hooks'
import { itemsReducer } from '../../redux/slices/items'

const ItemListDropdownContainer = (): JSX.Element => {
    const itemsState = useAppSelector((state) => state.items)
    const [state] = useReducer(itemsReducer, itemsState)
    const { selectedItemList } = state
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)
    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            disabled={!selectedItemList}
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {selectedItemList !== undefined &&
                    `List Items: ${selectedItemList.length}`}
            </DropdownToggle>
            <ItemListDropdown />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
