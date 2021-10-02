import React, { FC, useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import allActions from '../../redux/actions'
import { useAppDispatch } from '../../redux/hooks'

type DefaultProps = {
    classificationId: string | undefined
    subMenuId: string | undefined
}
const defaultProps = {
    classificationId: undefined,
    subMenuId: undefined,
} as DefaultProps
interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    handleCancel: () => void
    classificationId?: string
    subMenuId?: string
    listItemSelection: IListItem
}

const EditItemList: FC<Props> = ({
    handleCancel,
    classificationId,
    subMenuId,
    listItemSelection,
}) => {
    const { name, title, link } = listItemSelection
    const dispatch = useAppDispatch()
    const [parentId, setParentId] = useState('')
    const [parentType, setParentType] = useState('')

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
        dispatch(
            allActions.remove.deleteItem({ parentId, parentType, title, name })
        )
    }

    return (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{name}</span>
            <Button outline color="danger" onClick={() => handleCancel()}>
                <span>Cancel</span>
            </Button>
            <Button color="danger" onClick={handleDelete}>
                <span>Delete</span>
            </Button>
            {/* <EditDataName id={id} type="submenu" currentName={name} /> */}
        </div>
    )
}
EditItemList.defaultProps = defaultProps
export default EditItemList
