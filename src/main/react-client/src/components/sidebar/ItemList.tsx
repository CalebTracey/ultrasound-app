/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { useHistory } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectedItem, getLinkUrl } from '../../redux/slices/item'
import { IListItem } from '../../schemas'
import Item from './Item'

interface Props {
    listItems: IListItem[]
    parentId: string
}

const ListItemGroup: FC<Props> = ({ parentId, listItems }) => {
    const { contentPath } = useAppSelector((state) => state.auth)
    const history = useHistory()
    const dispatch = useAppDispatch()

    const handleItemClick = (menuItem: IListItem) => {
        if (parentId !== undefined) {
            dispatch(selectedItem({ parentId, item: menuItem }))
            dispatch(getLinkUrl(menuItem.link))

            history.push(`${contentPath}/video/${menuItem.link}`)
        }
    }
    const subMenuGroup =
        listItems &&
        listItems.map((item) => (
            <Item menuItem={item} handleItemClick={handleItemClick}>
                {item.name}
            </Item>
        ))
    return <>{subMenuGroup}</>
}

export default ListItemGroup
