import React, { FC } from 'react'
// import { Label } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import SubMenuDropdownContainer from '../edit-dropdowns/SubMenuDropdownContainer'
import EditSubMenu from './EditSubMenu'

interface Props {
    subMenuCount: number
    hasSubMenu: boolean
}
const EditSubMenuContainer: FC<Props> = ({ subMenuCount, hasSubMenu }) => {
    const { editing, loading } = useAppSelector((state) => state.subMenu)

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hasSubMenu && (
                <SubMenuDropdownContainer subMenuCount={subMenuCount} />
            )}
            {editing && loading === 'idle' && <EditSubMenu />}
        </div>
    )
}

export default EditSubMenuContainer
