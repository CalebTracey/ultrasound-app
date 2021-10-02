import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditDataName from './EditDataName'

interface IState {
    listItem: {
        name: string
        title: string
        link: string
    }
}
interface ISubMenuListItem {
    name: string
    title: string
    link: string
}
interface Props {
    id: string
    name: string
    itemList: ISubMenuListItem[]
    handleCancel: () => void
}

const EditSubMenu: FC<Props> = ({ id, name, itemList, handleCancel }) => {
    const [listItemSelection, setListItemSelection] = useState<
        IState['listItem'] | undefined
    >(undefined)

    return (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{name}</span>

            <Button outline color="danger" onClick={() => handleCancel()}>
                <span>Cancel</span>
            </Button>
            <Button color="danger">
                <span>Delete</span>
            </Button>
            <EditDataName id={id} type="submenu" currentName={name} />
            {itemList.length !== 0 && (
                <ItemListDropdownContainer
                    listItems={itemList}
                    setListItemSelection={setListItemSelection}
                />
            )}
        </div>
    )
}

export default EditSubMenu
