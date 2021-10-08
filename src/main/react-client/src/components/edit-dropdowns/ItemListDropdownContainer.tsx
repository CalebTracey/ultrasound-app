import React, { FC, useState, useEffect } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import ItemListDropdown from './ItemListDropdown'
import { useAppSelector } from '../../redux/hooks'
import { IListItem } from '../../schemas'

const ItemListDropdownContainer: FC = () => {
    const { itemList, size } = useAppSelector((state) => state.item)
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const [items, setItems] = useState<IListItem[] | []>([])
    const { subMenu } = useAppSelector((state) => state)
    const { classification } = useAppSelector((state) => state)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)

    useEffect(() => {
        if (subMenu.editing) {
            setItems(subMenu.itemList)
        }
        if (classification.editing) {
            setItems(classification.selected.listItems)
        }
    }, [classification, subMenu])

    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            disabled={!items}
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {items && `List Items: ${items.length}`}
            </DropdownToggle>
            <ItemListDropdown />
        </ButtonDropdown>
    )
}

export default ItemListDropdownContainer
