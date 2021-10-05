import React from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppSelector } from '../../redux/hooks'
import { getOne } from '../../redux/slices/subMenu'

const SubMenuItemList = (): JSX.Element => {
    const { subMenus } = useAppSelector(
        (state) => state.classification.selected
    )

    const setSelectedSubMenu = (id: string) => {
        getOne(id)
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
