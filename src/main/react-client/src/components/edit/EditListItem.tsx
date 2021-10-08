import React, { FC, useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import EditItemName from './EditItemName'

const EditItemList: FC = () => {
    const { selected } = useAppSelector((state) => state.item)
    const { name, link } = selected
    // const [parentId, setParentId] = useState('')
    // const [parentType, setParentType] = useState('')

    // const appDispatch = useAppDispatch()

    // useEffect(() => {
    //     if (classificationId !== undefined && subMenuId === undefined) {
    //         const parentIdInit: string = classificationId
    //         setParentId(parentIdInit)
    //         setParentType('classification')
    //     } else if (subMenuId !== undefined && classificationId === undefined) {
    //         const parentIdInit: string = subMenuId
    //         setParentId(parentIdInit)
    //         setParentType('submenu')
    //     }
    // }, [classificationId, subMenuId])

    const handleDelete = () => {
        if (selected !== undefined) {
            if (link && name) {
                // appDispatch(
                //     allActions.remove.deleteItem({
                //         parentId,
                //         parentType,
                //         link,
                //         name,
                //     })
                // )
            }
        }
    }

    return selected !== undefined ? (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{selected.name}</span>
            {/* <Button outline color="danger" onClick={() => handleCancel()}>
                <span>Cancel</span>
            </Button> */}
            <Button color="danger" onClick={handleDelete}>
                <span>Delete</span>
            </Button>
            <EditItemName name={name} />
        </div>
    ) : (
        <>Loading...</>
    )
}
export default EditItemList
