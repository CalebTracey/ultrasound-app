/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import React, { FC, useState } from 'react'
import SubMenuComponent from './SubMenuComponent'

type TSubMenu = {
    key: string
    value: string
}
interface ISubMenu {
    [key: string]: string
}
interface Props {
    subMenus: ISubMenu[]
}

const SubMenuItemGroup: FC<Props> = ({ subMenus }): JSX.Element => {
    const subMenuGroup: JSX.Element[] = Object.keys(subMenus).map(
        (key: string) => {
            return (
                <SubMenuComponent
                    key={subMenus[key]}
                    id={subMenus[key]}
                    title={key}
                />
            )
        }
    )

    return <>{subMenuGroup}</>
}

export default SubMenuItemGroup
