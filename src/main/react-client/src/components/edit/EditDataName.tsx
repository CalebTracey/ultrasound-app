import React, { FC, useState } from 'react'
import { Button, InputGroupAddon } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'
import { editDataName } from '../../redux/slices/edit'
import eventBus from '../../common/EventBus'
import { getAllClassifications } from '../../redux/slices/classification'

interface Props {
    id: string
    currentName: string
    type: 'subMenu' | 'classification'
}

const EditDataName: FC<Props> = ({ currentName, id, type }) => {
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()

    const onSubmit = () => {
        dispatch(editDataName({ id, textValue, type }))
        eventBus.dispatch('updateItems')
        dispatch(getAllClassifications())
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
