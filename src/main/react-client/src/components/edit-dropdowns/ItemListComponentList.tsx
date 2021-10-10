import React, { FC } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { IListItem } from '../../schemas'
import ListItem from './ListItem'

const ItemListComponentList: FC = () => {
    const { itemList, size, loading } = useAppSelector((state) => state.item)
    const listNode =
        size !== 0 &&
        loading === 'successful' &&
        (itemList as IListItem[]).map((listItem: IListItem) => {
            return <ListItem item={listItem} />
        })

    return <>{listNode}</>
}
export default ItemListComponentList
