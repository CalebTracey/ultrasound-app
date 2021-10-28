/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import EditListItem from './EditListItem'
import { useAppSelector } from '../../redux/hooks'

const EditItemListContainer: FC = (): JSX.Element | null => {
    const { size, loading, editing } = useAppSelector((state) => state.item)

    return size !== 0 && loading === 'successful' && editing ? (
        <EditListItem />
    ) : null
}
export default EditItemListContainer
