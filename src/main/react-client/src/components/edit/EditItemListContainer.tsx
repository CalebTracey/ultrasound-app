import React, { FC, useEffect, useState } from 'react'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditItemList from './EditItemList'

type DefaultProps = {
    classificationId: string | undefined
    subMenuId: string | undefined
}
const defaultProps = {
    classificationId: undefined,
    subMenuId: undefined,
} as DefaultProps
interface IState {
    listItem: {
        name: string
        title: string
        link: string
    }
}
interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: IListItem[]
    editingListItem: boolean
    classificationId?: string
    subMenuId?: string
    handleCancel: () => void
    setEditingListItem: (editingListItem: boolean) => void
}

const EditItemListContainer: FC<Props> = ({
    listItems,
    classificationId,
    subMenuId,
    handleCancel,
    setEditingListItem,
    editingListItem,
}) => {
    const [listItemSelection, setListItemSelection] = useState<
        IState['listItem'] | undefined
    >(undefined)

    useEffect(() => {
        if (listItemSelection !== undefined && setEditingListItem) {
            setEditingListItem(true)
        }
    }, [listItemSelection, setEditingListItem])

    return (
        <>
            {listItems.length !== 0 && (
                <ItemListDropdownContainer
                    listItems={listItems}
                    setListItemSelection={setListItemSelection}
                />
            )}
            {editingListItem && listItemSelection !== undefined && (
                <EditItemList
                    handleCancel={handleCancel}
                    classificationId={classificationId}
                    subMenuId={subMenuId}
                    listItemSelection={listItemSelection}
                />
            )}
        </>
    )
}

EditItemListContainer.defaultProps = defaultProps

export default EditItemListContainer
