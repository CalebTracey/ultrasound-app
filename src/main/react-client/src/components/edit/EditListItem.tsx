import React, { FC, useCallback, useState } from 'react'
import {
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Container,
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import EditItemName from './EditItemName'
import { deleteItem, deleteData } from '../../redux/slices/edit'
import { IListItem } from '../../schemas'
import WarningModal from '../WarningModal'

const EditItemList: FC = () => {
    const [modal, setModal] = useState(false)
    const { selected, itemType, parentId } = useAppSelector(
        (state) => state.item
    )
    const { subMenu, auth } = useAppSelector((state) => state)
    const { name, link } = selected
    const history = useHistory()
    const dispatch = useAppDispatch()

    const isItem = (value: unknown): value is IListItem => {
        return !!value && !!(value as IListItem)
    }

    const toggle = useCallback(() => {
        setModal(!modal)
    }, [modal])

    const handleEditItemParent = () => {
        history.push(`${auth.contentPath}/move/${link}`)
    }

    const handleDelete = () => {
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
                    dispatch(deleteData({ id: parentId, type: 'subMenu' }))
                }
            }
        }
    }

    return (
        <div className="edit___item">
            <Container className="edit___text-wrap">
                <span className="span-header___capital___light">
                    Selected scan:{' '}
                </span>
                <span className="span-header___capital">{`"${name}"`}</span>
                <Button
                    style={{ marginLeft: '1rem' }}
                    type="button"
                    outline
                    color="primary"
                    onClick={handleEditItemParent}
                >
                    <span>Move</span>
                </Button>
                <Button
                    style={{ marginLeft: '1rem' }}
                    color="danger"
                    outline
                    onClick={toggle}
                >
                    <span>Delete</span>
                </Button>
            </Container>
            <br />

            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>Edit Title</InputGroupText>
                </InputGroupAddon>
                {isItem(selected) && parentId && (
                    <EditItemName
                        id={parentId}
                        item={selected}
                        type={itemType}
                    />
                )}
            </InputGroup>
            <WarningModal
                actionText="Permanently delete"
                itemText={name}
                setModal={modal}
                toggleCallback={toggle}
                modalAction={handleDelete}
            />
        </div>
    )
}
export default EditItemList
