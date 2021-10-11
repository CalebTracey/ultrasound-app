import React, { FC } from 'react'
// import { Label } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import EditSubMenu from './EditSubMenu'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditListItem from './EditListItem'

const EditSubMenuContainer: FC = () => {
    const { subMenu, item } = useAppSelector((state) => state)

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <EditSubMenu />
            {item.size &&
                item.itemType === 'subMenu' &&
                subMenu.loading !== 'successful' && (
                    <>
                        {subMenu.editing && <ItemListDropdownContainer />}
                        {item.editing && <EditListItem />}
                    </>
                )}
        </div>
    )
}

export default EditSubMenuContainer
