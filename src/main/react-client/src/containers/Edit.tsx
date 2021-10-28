/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { Button, Container } from 'reactstrap'
import { useAppSelector } from '../redux/hooks'
import EditHeader from '../components/edit/EditHeader'
import { IClassification } from '../schemas'
import EditContentPane from '../components/edit/EditContentPane'
import DeleteButton from '../components/buttons/DeleteButton'

const Edit: FC = (): JSX.Element | null => {
    const { auth } = useAppSelector((state) => state)
    const { selected, subMenuCount, editing } = useAppSelector(
        (state) => state.classification
    )
    const history = useHistory()

    const isClassification = (value: unknown): value is IClassification => {
        return !!value && !!(value as IClassification)
    }
    const handleCancel = () => {
        if (auth.contentPath) {
            history.push(auth.contentPath)
        }
    }

    return isClassification(selected) && auth.contentPath ? (
        <>
            <Container>
                <Button
                    style={{ position: 'relative' }}
                    outline
                    color="danger"
                    onClick={handleCancel}
                >
                    <span className="edit___drop-down-item">Cancel</span>
                </Button>
                <DeleteButton
                    id={selected._id}
                    type="classification"
                    title="Delete"
                />
                <EditHeader
                    classification={selected}
                    subMenuCount={subMenuCount}
                    hasSubMenu={selected.hasSubMenu}
                />
            </Container>
            <div className="edit">
                <hr className="my-2" />
                <EditContentPane
                    hasSubMenu={selected.hasSubMenu}
                    editing={editing}
                />
            </div>
        </>
    ) : null
}

export default withRouter(Edit)
