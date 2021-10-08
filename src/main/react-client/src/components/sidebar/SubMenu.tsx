/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { FC, useState, useEffect } from 'react'
import { SubMenu } from 'react-pro-sidebar'
import useSubMenu from '../../hooks/useSubMenu'
import ItemList from './ItemList'
import { IListItem } from '../../schemas'

interface Props {
    id: string
    title: string
}

const SubMenuComponent: FC<Props> = ({ id, title }) => {
    const [itemList, setItemList] = useState<IListItem[] | []>([])
    const [response, getSubMenu] = useSubMenu({
        id,
        subMenuObj: {},
        isLoading: false,
        error: null,
    })
    const { isLoading, subMenuObj } = response

    const isItemList = (value: unknown): value is IListItem[] => {
        return !!value && !!(value as IListItem[])
    }
    const onClickHandler = () => {
        getSubMenu()
    }

    useEffect(() => {
        if (isItemList(subMenuObj.itemList)) {
            setItemList(subMenuObj.itemList)
        }
    }, [subMenuObj])

    return (
        <SubMenu
            style={{ zIndex: 5 }}
            key={`sm${id}`}
            title={title}
            onClick={onClickHandler}
        >
            {!isLoading && isItemList(itemList) ? (
                <ItemList parentId={id} listItems={itemList} />
            ) : (
                <>Loading... SM</>
            )}
        </SubMenu>
    )
}

export default SubMenuComponent
