/* eslint-disable no-underscore-dangle */
import React, { FC, MouseEvent, useEffect } from 'react'
import { DropdownItem } from 'reactstrap'
import useSubMenu from '../../hooks/useSubMenu'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { editingSubMenu } from '../../redux/slices/subMenu'

interface Props {
    id: string
    title: string
}
const SubMenuDropdownItem: FC<Props> = ({ id, title }) => {
    const loadingClassification = useAppSelector(
        (state) => state.classification.loading
    )
    const loadingSubMenu = useAppSelector((state) => state.subMenu.loading)
    const [response, getSubMenu] = useSubMenu({
        id,
        subMenuObj: {},
        isLoading: false,
        error: null,
    })
    const { isLoading } = response
    const dispatch = useAppDispatch()

    const handleEditSubMenu = (e: MouseEvent) => {
        e.preventDefault()
        if (!isLoading && loadingSubMenu !== 'pending') {
            getSubMenu()
            dispatch(editingSubMenu(true))
        }
    }
    // useEffect(() => {
    //     const controller = new AbortController()
    //     return controller?.abort()
    // }, [])

    return !isLoading && loadingClassification === 'successful' ? (
        <DropdownItem
            style={{ textTransform: 'uppercase' }}
            onClick={handleEditSubMenu}
        >
            {title}
        </DropdownItem>
    ) : (
        <>Loading...</>
    )
}

export default SubMenuDropdownItem
