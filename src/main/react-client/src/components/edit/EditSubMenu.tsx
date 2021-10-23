/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import EditDataName from './EditDataName'
import DeleteButton from '../buttons/DeleteButton'
import EditListItemContainer from './EditListItemContainer'
import { useAppSelector } from '../../redux/hooks'

const EditSubMenu: FC = () => {
    const { selected } = useAppSelector((state) => state.subMenu)
    const classificationId = useAppSelector(
        (state) => state.classification.selected._id
    )
    const { _id, name } = selected

    return (
        <div className="edit___content">
            <div className="edit___item">
                <span className="span-header___capital___light">
                    Sub-Classification:{' '}
                </span>
                <span className="span-header___capital">{name}</span>
                <DeleteButton
                    id={`${classificationId}/${_id}`}
                    type="submenu"
                    title="Delete"
                />
                <EditDataName
                    id={`${classificationId}/${_id}`}
                    type="submenu"
                    currentName={name}
                />
            </div>
            <EditListItemContainer />
        </div>
    )
}

export default EditSubMenu
