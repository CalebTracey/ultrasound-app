import React, { FC } from 'react'
import { Button } from 'reactstrap'

interface Props {
    category: string
}

const DeleteButton: FC<Props> = ({ category }) => (
        <Button className="danger-btn-edit" outline color="danger">
            Delete
        </Button>
    )

export default DeleteButton
