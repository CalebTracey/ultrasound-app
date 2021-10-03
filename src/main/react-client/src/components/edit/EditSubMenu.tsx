/* eslint-disable no-underscore-dangle */
import React from 'react'
import { Button } from 'reactstrap'
import EditDataName from './EditDataName'
import DeleteButton from '../buttons/DeleteButton'
import EditItemListContainer from './EditItemListContainer'
import { useAppSelector } from '../../redux/hooks'
import EventBus from '../../common/EventBus'

const EditSubMenu = (): JSX.Element => {
    const { selectedSubMenu } = useAppSelector((state) => state.data)
    const { selectedEdit } = useAppSelector((state) => state.data)
    const classificationId = selectedEdit._id
    const { _id, name } = selectedSubMenu

    const dispatchCancel = () => {
        EventBus.dispatch('cancel')
    }

    return (
        <div>
            <span style={{ textTransform: 'uppercase' }}>{name}</span>
            <Button outline color="danger" onClick={dispatchCancel}>
                <span>Cancel</span>
            </Button>
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
            <EditItemListContainer />
        </div>
    )
}

export default EditSubMenu
