/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { FC, useCallback } from 'react'
import { useHistory } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectedItem, getLinkUrl } from '../../redux/slices/item'
import { newError } from '../../redux/slices/message'
import { IListItem } from '../../schemas'
import Item from './Item'

interface Props {
    listItems: IListItem[]
    parentId: string
}

const ItemList: FC<Props> = ({ parentId, listItems }) => {
    const { contentPath } = useAppSelector((state) => state.auth)
    const history = useHistory()
    const dispatch = useAppDispatch()

    const handleItemClick = useCallback(
        (menuItem: IListItem) => {
            const controller = new AbortController()

            if (parentId !== undefined && contentPath) {
                dispatch(selectedItem({ parentId, item: menuItem }))
                dispatch(getLinkUrl(menuItem.link))
                    .then(() => {
                        history.push(`${contentPath}/video/${menuItem.link}`)
                    })
                    .catch((err) => {
                        dispatch(newError(err))
                        history.push(contentPath)
                    })
            }
            return () => controller.abort()
        },
        [contentPath, history, dispatch, parentId]
    )
    const subMenuGroup =
        listItems &&
        listItems.map((item) => (
            <Item
                key={item.link}
                menuItem={item}
                handleItemClick={handleItemClick}
            >
                {item.name}
            </Item>
        ))
    return <>{subMenuGroup}</>
}

export default ItemList
