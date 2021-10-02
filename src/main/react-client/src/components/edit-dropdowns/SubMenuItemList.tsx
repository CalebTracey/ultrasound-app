import React, { FC } from 'react'
import { DropdownItem } from 'reactstrap'

interface ISubMenu {
    key: string
    value: string
}
interface Props {
    subMenus: { [key: string]: ISubMenu }
    setSubMenuSelection: (subMenu: ISubMenu) => void
}

const SubMenuItemList: FC<Props> = ({ subMenus, setSubMenuSelection }) => {
    const listNode = Object.keys(subMenus).map((key: string) => {
        return (
            <DropdownItem
                style={{ textTransform: 'uppercase' }}
                onClick={() => setSubMenuSelection(subMenus[key])}
            >
                {key}
            </DropdownItem>
        )
    })
    return <>{listNode}</>
}

export default SubMenuItemList
