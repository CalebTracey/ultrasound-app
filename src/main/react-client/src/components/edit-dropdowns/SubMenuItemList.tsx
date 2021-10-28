/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { useAppSelector } from '../../redux/hooks'
import SubMenuDropdownItem from './SubMenuDropdownItem'

const SubMenuItemList: FC = () => {
    const { subMenus } = useAppSelector(
        (state) => state.classification.selected
    )

    const listNode = Object.keys(subMenus).map((key: string) => {
        return (
            <SubMenuDropdownItem
                id={subMenus[key]}
                key={subMenus[key]}
                title={key}
            />
        )
    })
    return <>{listNode}</>
}

export default SubMenuItemList
