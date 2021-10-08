/* eslint-disable react/require-default-props */
import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'

interface Props {
    name: string
}
const EditItemName: FC<Props> = ({ name }) => {
    const [active, setActive] = useState(false)
    const [textValue, setTextValue] = useState<string>('')
    // const dispatch = useAppDispatch()
    const onSubmit = () => {
        // dispatch(
        //     allActions.edit.itemName({ id, link, textValue, type, currentName })
        // )
        // console.log('edit')
    }

    return active ? (
        <div style={{ display: 'flex' }}>
            <EditDataNameForm
                currentName={name}
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
            onClick={() => setActive(true)}
        >
            <span>Edit Name</span>
        </Button>
    )
}

export default EditItemName
