import React, { FC, useState, useEffect } from 'react'
import { Label } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'

import SubMenuDropdownContainer from '../edit-dropdowns/SubMenuDropdownContainer'
import EditSubMenu from './EditSubMenu'
import allActions from '../../redux/actions'

interface IState {
    subMenu: {
        key: string
        value: string
    }
}
interface ISubMenu {
    key: string
    value: string
}
interface Props {
    setEditingSubMenu: (state: boolean) => void
    subMenus: { [key: string]: ISubMenu }
    hasSubMenu: boolean
    editingSubMenu: boolean
    handleCancel: () => void
    classificationId: string
}
const EditSubMenuContainer: FC<Props> = ({
    subMenus,
    hasSubMenu,
    editingSubMenu,
    setEditingSubMenu,
    handleCancel,
    classificationId,
}) => {
    const { selectedSubMenu } = useAppSelector((state) => state.data)
    const { _id, name, itemList } = selectedSubMenu
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()

    const [subMenuSelection, setSubMenuSelection] = useState<
        IState['subMenu'] | undefined
    >(undefined)

    useEffect(() => {
        if (subMenuSelection !== undefined) {
            setIsLoading(true)
            setEditingSubMenu(true)
            dispatch(allActions.data.subMenu(subMenuSelection))
            setIsLoading(false)
        }
    }, [subMenuSelection, dispatch, setEditingSubMenu])

    return !isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hasSubMenu && (
                <SubMenuDropdownContainer
                    setSubMenuSelection={setSubMenuSelection}
                    hasSubMenu={hasSubMenu}
                    subMenus={subMenus}
                />
            )}
            {itemList !== undefined && editingSubMenu && (
                <EditSubMenu
                    handleCancel={handleCancel}
                    // subMenuData={selectedSubMenu}
                    id={`${classificationId}/${_id}`}
                    name={name}
                    itemList={itemList}
                />
            )}
        </div>
    ) : (
        <> Loading...</>
    )
}

export default EditSubMenuContainer
