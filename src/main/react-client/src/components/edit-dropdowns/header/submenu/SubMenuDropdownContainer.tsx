/* eslint-disable react/prop-types */
import React, { useState, FC } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import { useAppSelector } from '../../../../redux/hooks'
import SubMenuDropdown from './SubMenuDropdown'

interface Props {
    subMenuCount: number
}
const SubMenuDropdownContainer: FC<Props> = ({ subMenuCount }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const { subMenu, classification } = useAppSelector((state) => state)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)

    return (
        <ButtonDropdown
            style={{ margin: '1rem' }}
            addonType="prepend"
            isOpen={subMenuOpen}
            toggle={subMenuToggle}
            disabled={classification.loading !== 'successful'}
        >
            <DropdownToggle caret>
                {!subMenu.editing ? (
                    <span className="edit___drop-down-item">
                        {classification.loading === 'pending' ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            `Sub-menus: ${subMenuCount}`
                        )}
                    </span>
                ) : (
                    <span className="edit___drop-down-item">
                        {classification.loading === 'pending' ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            subMenu.selected.name
                        )}
                    </span>
                )}
            </DropdownToggle>
            <SubMenuDropdown />
        </ButtonDropdown>
    )
}

export default SubMenuDropdownContainer
