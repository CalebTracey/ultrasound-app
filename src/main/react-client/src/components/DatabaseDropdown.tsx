import React, { FC } from 'react'
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap'

interface Props {
    dropDownOpen: boolean
    dropDownToggle: () => void
    databaseInitToggle: () => void
    databaseUpdateToggle: () => void
}

const DatabaseDropdown: FC<Props> = ({
    dropDownOpen,
    dropDownToggle,
    databaseInitToggle,
    databaseUpdateToggle,
}) => {
    return (
        <Dropdown isOpen={dropDownOpen} toggle={dropDownToggle}>
            <DropdownToggle caret>Dropdown</DropdownToggle>
            <DropdownMenu container="body">
                <DropdownItem onClick={databaseInitToggle}>
                    <span className="span-text">Reset Database</span>
                </DropdownItem>
                <DropdownItem onClick={databaseUpdateToggle}>
                    <span className="span-text">Update Database</span>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

export default DatabaseDropdown
