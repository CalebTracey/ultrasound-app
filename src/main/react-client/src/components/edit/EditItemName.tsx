import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'
import allActions from '../../redux/actions'

interface Props {
    id: string
    link: string
    currentName: string
    type: string
}

const EditItemName: FC<Props> = ({ id, link, currentName, type }) => {
    const [editClassNameActive, setEditClassNameActive] = useState(false)
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()

    const onSubmit = () => {
        dispatch(
            allActions.edit.itemName({ id, link, textValue, type, currentName })
        )
    }

    return editClassNameActive ? (
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
            onClick={() => setEditClassNameActive(true)}
        >
            <span>Edit Name</span>
        </Button>
    )
}

export default EditItemName
