import React from 'react'
// import { Label } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import SubMenuDropdownContainer from '../edit-dropdowns/SubMenuDropdownContainer'
import EditSubMenu from './EditSubMenu'

const EditSubMenuContainer = (): JSX.Element => {
    const { editingSubMenu } = useAppSelector((state) => state.edit)
    const { selectedEdit } = useAppSelector((state) => state.data)
    const { hasSubMenu } = selectedEdit

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hasSubMenu && <SubMenuDropdownContainer />}
            {editingSubMenu && <EditSubMenu />}
        </div>
    )
}

export default EditSubMenuContainer
