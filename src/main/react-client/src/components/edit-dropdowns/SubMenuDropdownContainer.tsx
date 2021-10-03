/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import SubMenuDropdown from './SubMenuDropdown'
import { useAppSelector } from '../../redux/hooks'

const SubMenuDropdownContainer = (): JSX.Element => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const { subMenus } = useAppSelector((state) => state.data.selectedEdit)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)

    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {`Sub Menus: ${Array.from(Object.keys(subMenus)).length}`}
            </DropdownToggle>
            <SubMenuDropdown />
        </ButtonDropdown>
    )
}

export default SubMenuDropdownContainer
