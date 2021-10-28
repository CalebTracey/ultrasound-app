import React, { FC, ChangeEvent } from 'react'
import { FormGroup, Label, Input } from 'reactstrap'

interface Props {
    currentName: string
    textValue: string
    setInputText: (textValue: string) => void
}

const EditDataNameForm: FC<Props> = (props: Props) => {
    const { textValue, setInputText, currentName } = props

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
    }
    return (
        <Input
            type="email"
            name="email"
            id="dataForm"
            placeholder={currentName}
            value={textValue}
            onChange={onChangeHandler}
        />
    )
}

export default EditDataNameForm
