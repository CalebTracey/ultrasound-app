import React, { FC, useState, useCallback } from 'react'
import { Button } from 'reactstrap'
import { useAppDispatch } from '../../redux/hooks'
import { deleteData } from '../../redux/slices/edit'
import WarningModal from '../WarningModal'

interface Props {
    id: string
    type: 'subMenu' | 'classification'
    title: string
}

const DeleteButton: FC<Props> = ({ id, type, title }) => {
    const [modal, setModal] = useState(false)
    const dispatch = useAppDispatch()
    const toggle = useCallback(() => {
        setModal(!modal)
    }, [modal])

    const handleDelete = () => {
        dispatch(
            deleteData({
                id,
                type,
            })
        )
        toggle()
    }

    return (
        <>
            <Button
                style={{ position: 'relative', marginLeft: '4rem' }}
                className="danger-btn-edit"
                outline
                color="danger"
                onClick={toggle}
            >
                {title}
            </Button>
            <WarningModal
                actionText="Permanently delete "
                itemText={type}
                setModal={modal}
                toggleCallback={toggle}
                modalAction={handleDelete}
            />
        </>
    )
}

export default DeleteButton
