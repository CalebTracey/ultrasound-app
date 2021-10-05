/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { ChangeEvent, FC, useState } from 'react'
import { PayloadAction } from '@reduxjs/toolkit'
import { SubMenu } from 'react-pro-sidebar'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import ListItemGroup from './ListItemGroup'
import { getOne } from '../../redux/slices/subMenu'
import item from '../../redux/slices/item'

type TContent = { [_id: string]: IListItem[] }[]
type TContent1 = { key: string; value: IListItem[] }[]
interface ISubMenuObj {
    _id: string
    name: string
    itemList: IListItem[]
}
interface Props {
    id: string
    title: string
}
interface IListItem {
    name: string
    title: string
    link: string
}

const SubMenuComponent: FC<Props> = ({ id, title }) => {
    const itemListState = useAppSelector((state) => state.item.listMap)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState<IListItem[] | []>([])
    const dispatch = useAppDispatch()
    const value = itemListState[id]

    const getItems = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        setIsLoading(true)
        if (itemListState !== {}) {
            if (value !== undefined) {
                setItems(value)
            } else {
                await dispatch(getOne(id)).then((res: PayloadAction<any>) => {
                    const retVal: ISubMenuObj = res.payload
                    setItems(retVal.itemList)
                    setIsLoading(false)
                })
            }
        }
    }

    return (
        <SubMenu key={`sm${id}`} title={title} onClick={getItems}>
            {!isLoading && (
                <ListItemGroup id={id} type="subMenu" listItems={items} />
            )}
        </SubMenu>
    )
}

export default SubMenuComponent
