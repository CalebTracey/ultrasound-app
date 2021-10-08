/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import React, { FC } from 'react'
import SubMenuComponent from './SubMenu'
import { ISubMenu } from '../../schemas'

interface Props {
    subMenus: ISubMenu[]
}

const SubMenuItemGroup: FC<Props> = ({ subMenus }) => {
    const subMenuGroup = Object.keys(subMenus).map((key: string) => {
        return (
            <SubMenuComponent
                key={subMenus[key]}
                id={subMenus[key]}
                title={key}
            />
        )
    })
    return <>{subMenuGroup}</>
}
export default SubMenuItemGroup
