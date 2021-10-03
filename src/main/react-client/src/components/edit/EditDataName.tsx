import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'
import allActions from '../../redux/actions'

interface Props {
    id: string
    currentName: string
    type: string
}

const EditDataName: FC<Props> = ({ id, currentName, type }) => {
    const [editDataNameActive, setEditDataNameActive] = useState(false)
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()

    const onSubmit = () => {
        dispatch(allActions.edit.dataName({ id, textValue, type }))
    }

    return editDataNameActive ? (
        <div style={{ display: 'flex' }}>
            <EditDataNameForm
                currentName={currentName}
                textValue={textValue}
                setInputText={setTextValue}
            />
            <Button color="primary" size="sm" onClick={onSubmit}>
                Save
            </Button>
        </div>
    ) : (
        <Button
            outline
            size="sm"
            color="primary"
            onClick={() => setEditDataNameActive(true)}
        >
            <span>Edit Name</span>
        </Button>
    )
}

export default EditDataName
