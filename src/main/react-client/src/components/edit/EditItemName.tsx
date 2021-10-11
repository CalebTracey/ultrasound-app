/* eslint-disable react/require-default-props */
import React, { FC, useState } from 'react'
import { Button } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'
import { editItemName } from '../../redux/slices/edit'
import { IListItem } from '../../schemas'

interface Props {
    id: string
    item: IListItem
    type: string
}
const EditItemName: FC<Props> = ({ id, item, type }) => {
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()

    const onSubmit = () => {
        dispatch(editItemName({ id, textValue, item, type }))
    }

    return (
        <>
            <EditDataNameForm
                currentName={item.name}
                textValue={textValue}
                setInputText={setTextValue}
            />

            <Button color="primary" onClick={onSubmit}>
                Save
            </Button>
        </>
    )
}

export default EditItemName
