/* eslint-disable react/require-default-props */
import React, { FC } from 'react'
import { IListItem } from '../../schemas'
import ListItem from './ListItem'

interface Props {
    loading: 'pending' | 'idle' | 'successful'
    itemList: IListItem[]
    size: number
}
const ItemListComponentList: FC<Props> = ({ size, itemList, loading }) => {
    const listNode =
        size !== 0 &&
        itemList &&
        loading === 'successful' &&
        (itemList as IListItem[]).map((listItem: IListItem) => {
            return <ListItem item={listItem} />
        })

    return <>{listNode}</>
}
export default ItemListComponentList
