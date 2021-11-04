import React, { FC, useEffect, useState } from 'react'
import { DropdownMenu } from 'reactstrap'
import ItemListComponentList from './ItemListComponentList'
import { useAppSelector } from '../../../../redux/hooks'
import { IListItem } from '../../../../schemas'
import eventBus from '../../../../common/EventBus'

const ItemListDropdown: FC = () => {
    const [items, setItems] = useState<IListItem[] | []>([])
    const { itemList, size, loading } = useAppSelector((state) => state.item)

    useEffect(() => {
        if (loading === 'successful' && itemList !== undefined) {
            setItems(itemList)
        }
        eventBus.dispatch('updateItems')
    }, [itemList, loading])

    return (
        <DropdownMenu
            modifiers={{
                setMaxHeight: {
                    enabled: true,
                    order: 890,
                    fn: (data) => ({
                        ...data,
                        styles: {
                            ...data.styles,
                            overflow: 'auto',
                            maxHeight: '10em',
                        },
                    }),
                },
            }}
        >
            <ItemListComponentList
                itemList={items}
                size={size}
                loading={loading}
            />
        </DropdownMenu>
    )
}

export default ItemListDropdown
