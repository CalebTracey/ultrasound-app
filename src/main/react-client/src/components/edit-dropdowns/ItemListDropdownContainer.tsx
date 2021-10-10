/* eslint-disable no-underscore-dangle */
import React, { FC, useState } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'
import { useAppSelector } from '../../redux/hooks'

const ItemListDropdownContainer: FC = () => {
    const { size, editing } = useAppSelector((state) => state.item)
    const [itemOpen, setItemOpen] = useState(false)
    const itemToggle = () => setItemOpen((prevState) => !prevState)

    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            disabled={!size}
            isOpen={itemOpen}
            toggle={itemToggle}
        >
            <DropdownToggle caret>{`List Items: ${size}`}</DropdownToggle>
            <ItemListDropdown />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
