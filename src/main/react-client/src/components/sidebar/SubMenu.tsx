/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { FC, useState, useCallback, useEffect } from 'react'
import { SubMenu } from 'react-pro-sidebar'
import useSubMenu from '../../hooks/useSubMenu'
import ItemList from './ItemList'
import { IListItem } from '../../schemas'
import { useAppSelector } from '../../redux/hooks'

interface Props {
    id: string
    title: string
}

const SubMenuComponent: FC<Props> = ({ id, title }) => {
    const [itemList, setItemList] = useState<IListItem[] | []>([])
    const { loading } = useAppSelector((state) => state.subMenu)
    const [response, getSubMenu] = useSubMenu({
        id,
        subMenuObj: {},
        isLoading: false,
        error: null,
    })
    const { subMenuObj } = response

    const isItemList = (value: unknown): value is IListItem[] => {
        return !!value && !!(value as IListItem[])
    }

    const updateItemList = useCallback(() => {
        if (isItemList(subMenuObj.itemList)) {
            setItemList(subMenuObj.itemList)
        }
    }, [subMenuObj])

    const onClickHandler = useCallback(() => {
        if (!response.isLoading) {
            getSubMenu()
        }
    }, [getSubMenu, response])

    useEffect(() => {
        if (loading === 'successful' && !response.isLoading) {
            updateItemList()
        }
    }, [loading, updateItemList, response])

    return (
        <SubMenu
            style={{ zIndex: 5 }}
            key={`sm${id}`}
            title={title}
            onClick={onClickHandler}
        >
            <ItemList parentId={id} listItems={itemList} />
        </SubMenu>
    )
}

export default SubMenuComponent
