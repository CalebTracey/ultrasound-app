import React, { FC } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

interface Props {
    setModal: boolean
    toggleCallback: () => void
    actionText: string
    itemText: string
    modalAction: () => void
}

const WarningModal: FC<Props> = ({
    setModal,
    toggleCallback,
    actionText,
    itemText,
    modalAction,
}) => {
    return (
        <div>
            <Modal isOpen={setModal} toggle={toggleCallback}>
                <ModalHeader toggle={toggleCallback}>
                    <span className="span-text">Warning!</span>
                </ModalHeader>
                <ModalBody>
                    <p className="span-text___light">
                        {actionText}{' '}
                        <span className="span-text___bold">{itemText}</span>?
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={modalAction}>
                        Confirm
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleCallback}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default WarningModal
