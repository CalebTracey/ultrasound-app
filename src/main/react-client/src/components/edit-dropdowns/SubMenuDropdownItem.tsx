/* eslint-disable no-underscore-dangle */
import React, { FC, MouseEvent } from 'react'
import { DropdownItem } from 'reactstrap'
import SyncLoader from 'react-spinners/SyncLoader'
import useSubMenu from '../../hooks/useSubMenu'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { editingSubMenu } from '../../redux/slices/subMenu'
import { resetItemSelection } from '../../redux/slices/item'

interface Props {
    id: string
    title: string
}
const SubMenuDropdownItem: FC<Props> = ({ id, title }) => {
    const loadingClassification = useAppSelector(
        (state) => state.classification.loading
    )
    const { subMenu } = useAppSelector((state) => state)
    const [response, getSubMenu] = useSubMenu({
        id,
        subMenuObj: {},
        isLoading: false,
        error: null,
    })
    const dispatch = useAppDispatch()

    const handleGetSubMenu = async () => getSubMenu()

    const handleEditSubMenu = (e: MouseEvent) => {
        e.preventDefault()
        if (!response.isLoading && subMenu.loading !== 'pending') {
            dispatch(editingSubMenu(true))
            dispatch(resetItemSelection())
            handleGetSubMenu()
        }
    }
    return !response.isLoading && loadingClassification === 'successful' ? (
        <DropdownItem
            style={{ textTransform: 'uppercase' }}
            onClick={handleEditSubMenu}
        >
            {title}
        </DropdownItem>
    ) : (
        <div className="spinner">
            <SyncLoader />
        </div>
    )
}

export default SubMenuDropdownItem
