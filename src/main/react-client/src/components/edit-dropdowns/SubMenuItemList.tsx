import React from 'react'
import { DropdownItem } from 'reactstrap'
import allActions from '../../redux/actions'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'

const SubMenuItemList = (): JSX.Element => {
    const { subMenus } = useAppSelector((state) => state.data.selectedEdit)
    const dispatch = useAppDispatch()

    const setSelectedSubMenu = (id: string) => {
        dispatch(allActions.data.subMenu(id))
    }
    const listNode = Object.keys(subMenus).map((key: string) => {
        return (
            <DropdownItem
                style={{ textTransform: 'uppercase' }}
                onClick={() => setSelectedSubMenu(subMenus[key])}
            >
                {key}
            </DropdownItem>
        )
    })
    return <>{listNode}</>
}

export default SubMenuItemList
