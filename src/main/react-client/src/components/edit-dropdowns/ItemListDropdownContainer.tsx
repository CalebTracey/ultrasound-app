/* eslint-disable no-underscore-dangle */
import React, { FC, useState } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'
import { useAppSelector } from '../../redux/hooks'

const ItemListDropdownContainer: FC = () => {
    const { size, editing, selected } = useAppSelector((state) => state.item)
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
            <DropdownToggle caret>
                {!editing ? (
                    <span className="edit___drop-down-item">{`Scans: ${size}`}</span>
                ) : (
                    <span className="edit___drop-down-item">
                        {selected.name}
                    </span>
                )}
            </DropdownToggle>
            <ItemListDropdown />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
