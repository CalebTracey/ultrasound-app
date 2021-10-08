/* eslint-disable react/prop-types */
import React, { useState, FC } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import SubMenuDropdown from './SubMenuDropdown'

interface Props {
    subMenuCount: number
}
const SubMenuDropdownContainer: FC<Props> = ({ subMenuCount }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)

    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)

    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
        >
            <DropdownToggle caret>
                {`Sub Menus: ${subMenuCount}`}
            </DropdownToggle>
            <SubMenuDropdown />
        </ButtonDropdown>
    )
}

export default SubMenuDropdownContainer
