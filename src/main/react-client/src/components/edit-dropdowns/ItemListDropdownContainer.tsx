import React, { useState } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'
import { useAppSelector } from '../../redux/hooks'

const ItemListDropdownContainer = (): JSX.Element => {
    const { entities } = useAppSelector((state) => state.item)
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)
    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            disabled={!entities}
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {entities !== undefined && `List Items: ${entities.length}`}
            </DropdownToggle>
            <ItemListDropdown />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
