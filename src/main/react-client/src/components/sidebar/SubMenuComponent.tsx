/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, FC, useReducer } from 'react'
import { SubMenu } from 'react-pro-sidebar'
import allActions from '../../redux/actions'
import ListItemGroup from './ListItemGroup'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import itemSlice, { itemsReducer, itemsState } from '../../redux/slices/items'
import editSlice, { editReducer, editState } from '../../redux/slices/edit'
import subMenuSlice from '../../redux/slices/subMenus'

interface Props {
    id: string
    title: string
}
const SubMenuComponent: FC<Props> = ({ id, title }) => {
    const { setSelectedSubMenu } = subMenuSlice.actions
    const { setSelectedItemList } = itemSlice.actions
    const { subMenusLoading } = editSlice.actions
    const [stateItems, itemsDispatch] = useReducer(itemsReducer, itemsState)
    const [stateEdit, editDispatch] = useReducer(editReducer, editState)
    const [stateSubMenu, subMenuDispatch] = useReducer(editReducer, editState)
    const { selectedItemList } = stateItems
    const dispatch = useAppDispatch()

    const getItems = () => {
        subMenuDispatch(subMenusLoading(true))
        dispatch(allActions.data.subMenu(id))
            .then(({ data }) => {
                itemsDispatch(setSelectedItemList(data.itemList))
                editDispatch(setSelectedSubMenu(data))
            })
            .catch((err) => {
                console.error(err)
            })
        if (selectedItemList !== undefined) {
            subMenuDispatch(subMenusLoading(false))
        }
    }
    return (
        <SubMenu key={`sm${id}`} title={title} onClick={() => getItems()}>
            {selectedItemList !== undefined && (
                <ListItemGroup listItems={selectedItemList} />
            )}
        </SubMenu>
    )
}

export default SubMenuComponent
