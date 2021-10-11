import React, { FC } from 'react'
import { Button } from 'reactstrap'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import EditItemName from './EditItemName'
import { deleteItem } from '../../redux/slices/edit'
import { IListItem } from '../../schemas'

const EditItemList: FC = () => {
    const { selected, itemType, parentId } = useAppSelector(
        (state) => state.item
    )
    const { name, link } = selected
    const dispatch = useAppDispatch()

    const isItem = (value: unknown): value is IListItem => {
        return !!value && !!(value as IListItem)
    }
    const handleDelete = () => {
        if (selected !== undefined && parentId && isItem(selected)) {
            if (link && name) {
                dispatch(
                    deleteItem({
                        id: parentId,
                        type: itemType.toLowerCase(),
                        item: selected,
                    })
                )
            }
        }
    }

    return (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{selected.name}</span>
            <Button
                style={{ marginLeft: '1rem' }}
                className="danger-btn-edit"
                outline
                color="danger"
                onClick={handleDelete}
            >
                <span>Delete</span>
            </Button>

            {isItem(selected) && parentId && (
                <EditItemName
                    id={parentId}
                    item={selected}
                    type={itemType.toLowerCase()}
                />
            )}
        </div>
    )
}
export default EditItemList
