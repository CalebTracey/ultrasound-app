/* eslint-disable react/prop-types */
import React, { useState, FC } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import SubMenuDropdown from './SubMenuDropdown'

interface ISubMenu {
    key: string
    value: string
}
interface Props {
    setSubMenuSelection: (subMenu: ISubMenu) => void
    hasSubMenu: boolean
    subMenus: { [key: string]: ISubMenu }
}
const SubMenuDropdownContainer: FC<Props> = ({
    setSubMenuSelection,
    hasSubMenu,
    subMenus,
}) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)
    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            disabled={!hasSubMenu}
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {`Sub Menus: ${Array.from(Object.keys(subMenus)).length}`}
            </DropdownToggle>
            <SubMenuDropdown
                setSubMenuSelection={setSubMenuSelection}
                subMenus={subMenus}
            />
        </ButtonDropdown>
    )
}

export default SubMenuDropdownContainer
