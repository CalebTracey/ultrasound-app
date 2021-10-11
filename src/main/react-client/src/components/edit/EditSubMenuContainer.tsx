import React, { FC } from 'react'
// import { Label } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import EditSubMenu from './EditSubMenu'
import ItemListDropdownContainer from '../edit-dropdowns/ItemListDropdownContainer'
import EditListItem from './EditListItem'

const EditSubMenuContainer: FC = () => {
    const { subMenu, item } = useAppSelector((state) => state)

    return (
        <EditSubMenu />
        // {/* {item.editing && <EditListItem />} */}
        // {/* {item.size &&
        //     item.itemType === 'subMenu' &&
        //     subMenu.loading !== 'successful' && (
        //         <div className="edit___content">
        //             {subMenu.editing && <ItemListDropdownContainer />}
        //         </div>
        //         // {item.editing && <EditListItem />}
        //     )} */}
    )
}

export default EditSubMenuContainer
