import React, { FC } from 'react'
import { Button } from 'reactstrap'
import allActions from '../../redux/actions'
import { useAppDispatch } from '../../redux/hooks'

interface Props {
    id: string
    type: string
    title: string
}

const DeleteButton: FC<Props> = ({ id, type, title }) => {
    const dispatch = useAppDispatch()

    const onClickHandler = () => {
        dispatch(allActions.remove.deleteData({ id, type }))
    }
    return (
        <Button
            className="danger-btn-edit"
            outline
            color="danger"
            onClick={onClickHandler}
        >
            {title}
        </Button>
    )
}

export default DeleteButton
