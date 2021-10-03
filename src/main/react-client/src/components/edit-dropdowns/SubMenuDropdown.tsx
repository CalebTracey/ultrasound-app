/* eslint-disable react/prop-types */
import React from 'react'
import { DropdownMenu } from 'reactstrap'
import SubMenuItemList from './SubMenuItemList'

const SubMenuDropdown = (): JSX.Element => (
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
        <SubMenuItemList />
    </DropdownMenu>
)

export default SubMenuDropdown
