import React, { FC } from 'react'
import { Button } from 'reactstrap'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import EditItemName from './EditItemName'
import { deleteItem } from '../../redux/slices/item'
import { IListItem } from '../../schemas'

const EditItemList: FC = () => {
    const { selected, itemType, parentId } = useAppSelector(
        (state) => state.item
    )
    const { name, link } = selected
    const dispatch = useAppDispatch()

    const isItemList = (value: unknown): value is IListItem => {
        return !!value && !!(value as IListItem)
    }
    const handleDelete = () => {
        if (selected !== undefined && parentId && isItemList(selected)) {
            if (link && name) {
                dispatch(
                    deleteItem({
                        id: parentId,
                        type: itemType,
                        item: selected,
                    })
                )
            }
        }
    }

    return (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{selected.name}</span>
            <Button color="danger" onClick={handleDelete}>
                <span>Delete</span>
            </Button>
            <EditItemName name={name} />
        </div>
    )
}
export default EditItemList
