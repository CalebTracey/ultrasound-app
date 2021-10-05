import React, { FC } from 'react'
// import { Label } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import SubMenuDropdownContainer from '../edit-dropdowns/SubMenuDropdownContainer'
import EditSubMenu from './EditSubMenu'

const EditSubMenuContainer: FC = () => {
    const { hasSubMenu } = useAppSelector(
        (state) => state.classification.selected
    )
    const { editing } = useAppSelector((state) => state.subMenu)

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hasSubMenu && <SubMenuDropdownContainer />}
            {editing && <EditSubMenu />}
        </div>
    )
}

export default EditSubMenuContainer
