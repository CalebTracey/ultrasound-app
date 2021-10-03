import React from 'react'
import { DropdownMenu } from 'reactstrap'
import ItemListComponentList from './ItemListComponentList'

const ItemListDropdown = (): JSX.Element => (
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
        <ItemListComponentList />
    </DropdownMenu>
)

export default ItemListDropdown
