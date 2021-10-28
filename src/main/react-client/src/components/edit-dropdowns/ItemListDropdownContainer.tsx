/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
import React, { FC, useState, useEffect } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'
import { useAppSelector } from '../../redux/hooks'

const ItemListDropdownContainer: FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const { editing, selected, size } = useAppSelector((state) => state.item)
    const { classification } = useAppSelector((state) => state)
    const [itemOpen, setItemOpen] = useState(false)
    const itemToggle = () => setItemOpen((prevState) => !prevState)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 250)
        return () => clearTimeout(timer)
    }, [])

    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            isOpen={itemOpen}
            toggle={itemToggle}
            disabled={classification.loading !== 'successful'}
        >
            <DropdownToggle caret>
                {!editing ? (
                    <span className="edit___drop-down-item">
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            `Scans: ${size}`
                        )}
                    </span>
                ) : (
                    <span className="edit___drop-down-item">
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : size < 15 ? (
                            selected.name
                        ) : (
                            'Items'
                        )}
                    </span>
                )}
            </DropdownToggle>
            <ItemListDropdown />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
