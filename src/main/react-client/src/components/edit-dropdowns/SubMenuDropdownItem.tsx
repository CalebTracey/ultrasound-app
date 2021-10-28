/* eslint-disable react/require-default-props */
/* eslint-disable no-underscore-dangle */
import React, { FC, useCallback } from 'react'
import { DropdownItem } from 'reactstrap'
import { useAppDispatch } from '../../redux/hooks'
import { editingSubMenu } from '../../redux/slices/subMenu'
import useSubMenu from '../../hooks/useSubMenu'
import { editingItems } from '../../redux/slices/item'

interface Props {
    id: string
    title: string
}
const SubMenuDropdownItem: FC<Props> = ({ id, title }) => {
    const dispatch = useAppDispatch()
    const [response, getSubMenu] = useSubMenu({
        id,
        subMenuObj: {},
        isLoading: false,
        error: null,
    })

    const onClickHandler = useCallback(() => {
        const ac = new AbortController()

        if (!response.isLoading) {
            dispatch(editingSubMenu(true))
            dispatch(editingItems(false))
            getSubMenu()
        }
        return ac.abort()
    }, [dispatch, response, getSubMenu])

    return (
        <DropdownItem
            style={{ textTransform: 'uppercase' }}
            onClick={onClickHandler}
        >
            {title}
        </DropdownItem>
    )
}

export default SubMenuDropdownItem
