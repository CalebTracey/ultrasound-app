import React, { useState, FC, useCallback } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { IListItem } from '../../schemas'
import WarningModal from '../WarningModal'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { deleteItem, deleteData } from '../../redux/slices/edit'

const VideoDeleteButton: FC = () => {
    const [modal, setModal] = useState(false)
    const { selected, itemType, parentId } = useAppSelector(
        (state) => state.item
    )
    const { subMenu, auth } = useAppSelector((state) => state)
    const { name, link } = selected
    const dispatch = useAppDispatch()
    const history = useHistory()

    const isItem = (value: unknown): value is IListItem => {
        return !!value && !!(value as IListItem)
    }

    const { contentPath } = auth
    const toggle = useCallback(() => {
        setModal(!modal)
    }, [modal])

    const handleDelete = useCallback(() => {
        if (selected !== undefined && parentId && isItem(selected)) {
            if (link && name) {
                dispatch(
                    deleteItem({
                        id: parentId,
                        type: itemType,
                        item: selected,
                    })
                )
                if (
                    selected.type === 'subMenu' &&
                    subMenu.selected.itemList.length === 1
                ) {
                    dispatch(deleteData({ id: parentId, type: itemType }))
                }
            }
        }
        if (contentPath) {
            history.push(contentPath)
        }
        // handleClassificationReset()
    }, [
        contentPath,
        dispatch,
        history,
        itemType,
        link,
        name,
        parentId,
        selected,
        subMenu,
    ])

    return (
        <>
            <button
                id="video-delete-button"
                type="button"
                className="btn btn-outline-danger menu-button"
                onClick={toggle}
            >
                <big>
                    <FiTrash2 />
                </big>
            </button>
            <WarningModal
                actionText="Permanently delete"
                itemText={name}
                setModal={modal}
                toggleCallback={toggle}
                modalAction={handleDelete}
            />
        </>
    )
}

export default VideoDeleteButton
