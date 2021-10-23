import React, { FC } from 'react'
import { Button } from 'reactstrap'
import { useAppDispatch } from '../../redux/hooks'
import { deleteData } from '../../redux/slices/edit'

interface Props {
    id: string
    type: string
    title: string
}

const DeleteButton: FC<Props> = ({ id, type, title }) => {
    const dispatch = useAppDispatch()

    const handleDelete = () => {
        dispatch(
            deleteData({
                id,
                type: type.toLowerCase(),
            })
        )
    }

    return (
        <Button
            style={{ marginLeft: '1rem' }}
            className="danger-btn-edit"
            outline
            color="danger"
            onClick={handleDelete}
        >
            {title}
        </Button>
    )
}

export default DeleteButton
