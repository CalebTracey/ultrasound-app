/* eslint-disable no-underscore-dangle */
import React, { FC, useState, useEffect } from 'react'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditListItem from './EditListItem'
import { useAppSelector } from '../../redux/hooks'
import { IListItem } from '../../schemas'

const EditItemListContainer: FC = () => {
    const { size, editing } = useAppSelector((state) => state.item)
    const [items, setItems] = useState<IListItem[] | []>([])
    const { subMenu } = useAppSelector((state) => state)
    const { classification } = useAppSelector((state) => state)

    useEffect(() => {
        if (subMenu.editing) {
            setItems(subMenu.itemList)
        }
        if (classification.editing) {
            setItems(classification.selected.listItems)
        }
    }, [classification, subMenu])

    return (
        <>
            {size !== 0 && <ItemListDropdownContainer />}
            {editing && <EditListItem />}
        </>
    )
}
export default EditItemListContainer
