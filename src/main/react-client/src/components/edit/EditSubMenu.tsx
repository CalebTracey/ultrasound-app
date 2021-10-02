import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
import EditDataName from './EditDataName'
import DeleteButton from '../buttons/DeleteButton'
import EditItemListContainer from './EditItemListContainer'

interface ISubMenuListItem {
    name: string
    title: string
    link: string
}
interface Props {
    classificationId: string
    subMenuId: string
    name: string
    itemList: ISubMenuListItem[]
    handleCancel: () => void
}

const EditSubMenu: FC<Props> = ({
    classificationId,
    subMenuId,
    name,
    itemList,
    handleCancel,
}) => {
    const [editingListItem, setEditingListItem] = useState(false)

    return (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{name}</span>
            <Button outline color="danger" onClick={() => handleCancel()}>
                <span>Cancel</span>
            </Button>
            <DeleteButton
                id={`${classificationId}/${subMenuId}`}
                type="submenu"
                title="Delete"
            />
            <EditDataName
                id={`${classificationId}/${subMenuId}`}
                type="submenu"
                currentName={name}
            />
            {itemList.length !== 0 && (
                <EditItemListContainer
                    listItems={itemList}
                    subMenuId={subMenuId}
                    handleCancel={handleCancel}
                    editingListItem={editingListItem}
                    setEditingListItem={setEditingListItem}
                />
            )}
        </div>
    )
}

export default EditSubMenu
