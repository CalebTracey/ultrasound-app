/* eslint-disable react/prop-types */
import React, { useState, FC, useEffect } from 'react'
import { ButtonDropdown, DropdownToggle } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import SubMenuDropdown from './SubMenuDropdown'

interface Props {
    subMenuCount: number
}
const SubMenuDropdownContainer: FC<Props> = ({ subMenuCount }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { subMenu, classification } = useAppSelector((state) => state)
    const subMenuToggle = () => setSubMenuOpen((prevState) => !prevState)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 250)
        return () => clearTimeout(timer)
    }, [])

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
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" />
                        ) : (
                            `Sub Menus: ${subMenuCount}`
                        )}
                    </span>
                ) : (
                    <span className="edit___drop-down-item">
                        {isLoading ? (
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
