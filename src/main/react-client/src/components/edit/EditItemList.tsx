import React, { FC, useState, useEffect, useReducer } from 'react'
import { Button } from 'reactstrap'
import allActions from '../../redux/actions'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import EditItemName from './EditItemName'
import { itemsReducer } from '../../redux/slices/items'

type DefaultProps = {
    classificationId: string | undefined
    subMenuId: string | undefined
}
const defaultProps = {
    classificationId: undefined,
    subMenuId: undefined,
} as DefaultProps
interface Props {
    classificationId?: string
    subMenuId?: string
}

const EditItemList: FC<Props> = ({ classificationId, subMenuId }) => {
    const itemsState = useAppSelector((state) => state.items)
    const [state, dispatch] = useReducer(itemsReducer, itemsState)
    const { selectedItem } = state
    const [parentId, setParentId] = useState('')
    const [parentType, setParentType] = useState('')

    const appDispatch = useAppDispatch()

    useEffect(() => {
        if (classificationId !== undefined && subMenuId === undefined) {
            const parentIdInit: string = classificationId
            setParentId(parentIdInit)
            setParentType('classification')
        } else if (subMenuId !== undefined && classificationId === undefined) {
            const parentIdInit: string = subMenuId
            setParentId(parentIdInit)
            setParentType('submenu')
        }
    }, [classificationId, subMenuId])

    const handleDelete = () => {
        if (selectedItem !== undefined) {
            if (selectedItem.link !== '' && selectedItem.name !== '') {
                const { link, name } = selectedItem
                appDispatch(
                    allActions.remove.deleteItem({
                        parentId,
                        parentType,
                        link,
                        name,
                    })
                )
            }
        }
    }

    return selectedItem !== undefined ? (
        <div>
            <span style={{ textTransform: 'uppercase' }}>
                {selectedItem.name}
            </span>
            {/* <Button outline color="danger" onClick={() => handleCancel()}>
                <span>Cancel</span>
            </Button> */}
            <Button color="danger" onClick={handleDelete}>
                <span>Delete</span>
            </Button>
            <EditItemName
                id={parentId}
                type={parentType}
                link={selectedItem.link}
                currentName={selectedItem.name}
            />
        </div>
    ) : (
        <>Loading...</>
    )
}
EditItemList.defaultProps = defaultProps
export default EditItemList
