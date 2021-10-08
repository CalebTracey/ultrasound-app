/* eslint-disable react/prop-types */
import React, { FC } from 'react'
import { DropdownMenu } from 'reactstrap'
import SubMenuItemList from './SubMenuItemList'

const SubMenuDropdown: FC = () => (
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
