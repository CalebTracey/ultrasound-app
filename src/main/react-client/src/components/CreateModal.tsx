/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react'
import {
    Button,
    Modal,
    FormGroup,
    ModalBody,
    ModalFooter,
    Label,
    Form,
} from 'reactstrap'
import {
    UseFormRegister,
    UseFormHandleSubmit,
    SubmitHandler,
} from 'react-hook-form'

type TFormValues = { name: string }

interface Props {
    setModal: boolean
    onSubmit: SubmitHandler<TFormValues>
    handleSubmit: UseFormHandleSubmit<TFormValues>
    toggleCallback: () => void
    actionText: string
    register: UseFormRegister<TFormValues>
}

const ConfirmModal: FC<Props> = ({
    setModal,
    toggleCallback,
    actionText,
    handleSubmit,
    onSubmit,
    register,
}) => {
    return (
        <div>
            <Modal isOpen={setModal} toggle={toggleCallback}>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <p className="span-text___light">{actionText} </p>
                        <FormGroup>
                            <Label for="name">
                                <span className="span-text">Name: </span>
                            </Label>
                            <input
                                className="form-control"
                                {...register('name')}
                            />
                        </FormGroup>
                        <Button color="primary" type="submit">
                            Confirm
                        </Button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleCallback}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ConfirmModal
