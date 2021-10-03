/* eslint-disable no-underscore-dangle */
import React from 'react'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditItemList from './EditItemList'
import { useAppSelector } from '../../redux/hooks'

const EditItemListContainer = (): JSX.Element => {
    const { editingListItem } = useAppSelector((state) => state.edit)
    const { selectedSubMenu } = useAppSelector((state) => state.subMenus)
    const { listItems } = useAppSelector((state) => state.data.selectedEdit)
    const classificationId = useAppSelector(
        (state) => state.data.selectedEdit._id
    )

    return (
        <>
            {listItems.length !== 0 && <ItemListDropdownContainer />}
            {editingListItem && selectedSubMenu !== undefined && (
                <EditItemList
                    classificationId={classificationId}
                    subMenuId={selectedSubMenu._id}
                />
            )}
        </>
    )
}

export default EditItemListContainer
