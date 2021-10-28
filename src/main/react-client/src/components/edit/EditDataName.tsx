import React, { FC, useState } from 'react'
import { Button, InputGroupAddon } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'
import { editDataName } from '../../redux/slices/edit'

interface Props {
    id: string
    currentName: string
    type: string
}

const EditDataName: FC<Props> = ({ currentName, id, type }) => {
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()

    const onSubmit = () => {
        dispatch(editDataName({ id, textValue, type }))
    }

    return (
        <>
            <EditDataNameForm
                currentName={currentName}
                textValue={textValue}
                setInputText={setTextValue}
            />
            <InputGroupAddon addonType="append">
                <Button color="primary" onClick={onSubmit}>
                    <span>Save</span>
                </Button>
            </InputGroupAddon>
        </>
    )
}

export default EditDataName
