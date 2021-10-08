/* eslint-disable no-underscore-dangle */
import React, { FC, MouseEvent } from 'react'
import { DropdownItem } from 'reactstrap'
import useSubMenu from '../../hooks/useSubMenu'
import { useAppDispatch } from '../../redux/hooks'
import { editingSubMenu } from '../../redux/slices/subMenu'
import { IListItem, ISubMenuObj } from '../../schemas'
import { selectedItemList } from '../../redux/slices/item'

interface Props {
    id: string
    title: string
}
const SubMenuDropdownItem: FC<Props> = ({ id, title }) => {
    const [response, getSubMenu] = useSubMenu({
        id,
        subMenuObj: {},
        isLoading: false,
        error: null,
    })
    const { isLoading, subMenuObj } = response
    const dispatch = useAppDispatch()

    const isItemList = (value: unknown): value is IListItem[] => {
        return !!value && !!(value as ISubMenuObj).itemList
    }
    const isString = (value: unknown): value is string => {
        return !!value && !!(value as ISubMenuObj)._id
    }

    const handleEditSubMenu = (e: MouseEvent) => {
        e.preventDefault()
        getSubMenu()
        const { _id, itemList } = subMenuObj
        if (!isLoading && isItemList(itemList) && isString(_id)) {
            dispatch(selectedItemList({ parentId: _id, list: itemList }))
            dispatch(editingSubMenu(true))
        }
    }

    return !isLoading ? (
        <DropdownItem
            style={{ textTransform: 'uppercase' }}
            onClick={handleEditSubMenu}
        >
            {title}
        </DropdownItem>
    ) : (
        <>Loading</>
    )
}

export default SubMenuDropdownItem
