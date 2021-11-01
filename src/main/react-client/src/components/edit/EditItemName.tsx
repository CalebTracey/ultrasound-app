/* eslint-disable react/require-default-props */
import React, { FC, useState } from 'react'
import { Button, InputGroupAddon } from 'reactstrap'
import EditDataNameForm from './EditDataNameForm'
import { useAppDispatch } from '../../redux/hooks'
import { editItemName } from '../../redux/slices/edit'
import { IListItem } from '../../schemas'
import eventBus from '../../common/EventBus'
import subMenu from '../../redux/slices/subMenu'
import { getAllClassifications } from '../../redux/slices/classification'

interface Props {
    id: string
    item: IListItem
    type: 'subMenu' | 'classification'
}
const EditItemName: FC<Props> = ({ id, item, type }) => {
    const [textValue, setTextValue] = useState<string>('')
    const dispatch = useAppDispatch()

    const onSubmit = () => {
        dispatch(editItemName({ id, textValue, item, type }))
        if (type === 'subMenu') {
            eventBus.dispatch('updateSubMenus')
            eventBus.dispatch('updateItems')
        } else {
            eventBus.dispatch('updateItems')
        }
        dispatch(getAllClassifications())
    }

    return (
        <>
            <EditDataNameForm
                currentName={item.name}
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

export default EditItemName
