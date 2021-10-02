import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
// import { FiEdit3 } from 'react-icons/fi'
import EditDataNameForm from './EditDataNameForm'
// const { editDataName } = EditService
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import allActions from '../../redux/actions'

interface Props {
    id: string
    currentName: string
    type: string
}

const EditDataName: FC<Props> = ({ id, currentName, type }) => {
    const [editClassNameActive, setEditClassNameActive] = useState(false)
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()
    const onClickHandler = () => {
        // editDataName({ id, textValue, type })
        dispatch(allActions.edit.dataName({ id, textValue, type }))
    }

    return editClassNameActive ? (
        <div style={{ display: 'flex' }}>
            <EditDataNameForm
                currentName={currentName}
                textValue={textValue}
                setInputText={setTextValue}
            />
            <Button color="primary" size="sm" onClick={onClickHandler}>
                Save
            </Button>
        </div>
    ) : (
        <Button
            outline
            size="sm"
            color="primary"
            onClick={() => setEditClassNameActive(true)}
        >
            <span>Edit Name</span>
        </Button>
    )
}

export default EditDataName
