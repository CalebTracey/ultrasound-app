/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditItemList from './EditItemList'
import { useAppSelector } from '../../redux/hooks'

type DefaultProps = {
    subMenuId: string | undefined
}
const defaultProps = {
    subMenuId: undefined,
} as DefaultProps
interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    listItems: IListItem[]
    classificationId: string
    subMenuId?: string
}

const EditItemListContainer: FC<Props> = ({
    listItems,
    classificationId,
    subMenuId,
}) => {
    const editingListItem = useAppSelector((state) => state.item.editing)

    return (
        <>
            {listItems.length !== 0 && <ItemListDropdownContainer />}
            {editingListItem && (
                <EditItemList
                    classificationId={classificationId}
                    subMenuId={subMenuId}
                />
            )}
        </>
    )
}
EditItemListContainer.defaultProps = defaultProps
export default EditItemListContainer
