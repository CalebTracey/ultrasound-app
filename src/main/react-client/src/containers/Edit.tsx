/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import { withRouter } from 'react-router-dom'
import { Container } from 'reactstrap'
import { useAppSelector } from '../redux/hooks'
import EditHeader from '../components/edit/EditHeader'
import { IClassification } from '../schemas'
import EditContentPane from '../components/edit/EditContentPane'
import DeleteButton from '../components/buttons/DeleteButton'

const Edit: FC = () => {
    const { auth } = useAppSelector((state) => state)
    const { selected, subMenuCount, editing } = useAppSelector(
        (state) => state.classification
    )

    const isClassification = (value: unknown): value is IClassification => {
        return !!value && !!(value as IClassification)
    }

    return isClassification(selected) && auth.contentPath ? (
        <>
            <DeleteButton
                id={selected._id}
                type="classification"
                title="Delete"
            />
            <Container>
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
