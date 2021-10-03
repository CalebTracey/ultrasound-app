import React, { useReducer } from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import itemSlice, { itemsReducer } from '../../redux/slices/items'

interface IListItem {
    name: string
    title: string
    link: string
}

const ItemListComponentList = (): JSX.Element => {
    const itemsState = useAppSelector((state) => state.items)
    const [state, dispatch] = useReducer(itemsReducer, itemsState)
    const { selectedItemList } = state
    const dispatchItemSelection = (item: IListItem) => {
        dispatch(
            itemSlice.actions.setSelectedItem({
                item,
            })
        )
    }
    const listNode =
        selectedItemList !== undefined ? (
            selectedItemList.map((listItem: IListItem) => (
                <DropdownItem onClick={() => dispatchItemSelection(listItem)}>
                    {listItem.name}
                </DropdownItem>
            ))
        ) : (
            <>Loading ...</>
        )
    return <>{listNode}</>
}

export default ItemListComponentList
