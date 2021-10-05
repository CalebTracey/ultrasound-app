/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import { MenuItem } from 'react-pro-sidebar'
import React, { FC, useState, useEffect, useCallback } from 'react'
import history from '../../helpers/history'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectedItem } from '../../redux/slices/item'
import { getOne } from '../../redux/slices/subMenu'

type TContent = { [_id: string]: IListItem[] }
interface IListItem {
    name: string
    title: string
    link: string
}
interface Props {
    id?: string
    type: string
    listItems?: IListItem[]
}
/**
 * TODO Pass id as param and store global map with {key: id; value: IListItem[]}
 *
 */
const ListItemGroup: FC<Props> = ({ id, type, listItems }) => {
    const { itemList } = useAppSelector((state) => state.subMenu)
    const [isLoading, setIsLoading] = useState(false)
    const [content, setContent] = useState<IListItem[] | []>([])
    const dispatch = useAppDispatch()

    const handleItemClick = (item: IListItem) => {
        dispatch(selectedItem(item))
        history.push(`/dashboard/video/${item.name}`)
    }

    const subMenuGroup =
        listItems !== undefined ? (
            listItems.map((item) => (
                <MenuItem
                    key={item.link}
                    title={item.name}
                    onClick={() => handleItemClick(item)}
                >
                    {item.name}
                </MenuItem>
            ))
        ) : (
            <>Loading</>
        )
    return <>{subMenuGroup}</>
}

export default ListItemGroup
