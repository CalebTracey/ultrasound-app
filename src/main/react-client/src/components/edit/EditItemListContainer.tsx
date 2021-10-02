import React, { FC } from 'react'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'

interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: IListItem[]
    setListItemSelection: (listItemSelection: IListItem) => void
}

const EditItemListContainer: FC<Props> = ({
    listItems,
    setListItemSelection,
}) => {
    return (
        <>
            {listItems.length !== 0 && (
                <ItemListDropdownContainer
                    listItems={listItems}
                    setListItemSelection={setListItemSelection}
                />
            )}
        </>
    )
}

export default EditItemListContainer
