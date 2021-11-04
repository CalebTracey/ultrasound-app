/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import { DropdownMenu } from 'reactstrap'
import React, { FC } from 'react'
import SubMenuItemList from './SubMenuItemList'

const SubMenuDropdown: FC = () => {
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
            <SubMenuItemList />
        </DropdownMenu>
    )
}

export default SubMenuDropdown
