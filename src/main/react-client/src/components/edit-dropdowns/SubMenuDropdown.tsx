/* eslint-disable react/prop-types */
import React, { FC } from 'react'
import { DropdownMenu } from 'reactstrap'
import SubMenuItemList from './SubMenuItemList'

interface ISubMenu {
    key: string
    value: string
}

interface Props {
    setSubMenuSelection: (subMenu: ISubMenu) => void
    subMenus: { [key: string]: ISubMenu }
}

const SubMenuDropdown: FC<Props> = ({ setSubMenuSelection, subMenus }) => (
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
        <SubMenuItemList
            setSubMenuSelection={setSubMenuSelection}
            subMenus={subMenus}
        />
    </DropdownMenu>
)

export default SubMenuDropdown
