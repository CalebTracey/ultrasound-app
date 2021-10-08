/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import history from '../../helpers/history'
import { useAppDispatch } from '../../redux/hooks'
import { selectedItem } from '../../redux/slices/item'
import { IListItem } from '../../schemas'
import Item from './Item'

interface Props {
    listItems: IListItem[]
    parentId: string
}

const ListItemGroup: FC<Props> = ({ parentId, listItems }) => {
    const dispatch = useAppDispatch()

    const handleItemClick = (menuItem: IListItem) => {
        if (parentId !== undefined) {
            dispatch(selectedItem({ parentId, item: menuItem }))
            history.push(`/dashboard/video/${menuItem.name}`)
        }
    }
    const subMenuGroup = listItems ? (
        listItems.map((item) => (
            <Item menuItem={item} handleItemClick={handleItemClick}>
                {item.name}
            </Item>
        ))
    ) : (
        <>Loading</>
    )
    return <>{subMenuGroup}</>
}

export default ListItemGroup
