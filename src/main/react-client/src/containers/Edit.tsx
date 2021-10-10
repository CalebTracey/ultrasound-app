/* eslint-disable no-underscore-dangle */
import React, { useEffect, FC, useCallback } from 'react'
import { withRouter } from 'react-router-dom'
import { Media, Jumbotron, Container, Alert, Button } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import EditSubMenuContainer from '../components/edit/EditSubMenuContainer'
import EditListItemContainer from '../components/edit/EditListItemContainer'
import EditDataName from '../components/edit/EditDataName'
import DeleteButton from '../components/buttons/DeleteButton'
import useClearSelections from '../hooks/useClearSelections'
import EventBus from '../common/EventBus'

// interface Props {
//     history: RouteComponentProps['history']
// }

const Edit: FC = () => {
    const { message } = useAppSelector((state) => state)
    const { selected, subMenuCount, loading, editing } = useAppSelector(
        (state) => state.classification
    )
    const subMenuEditing = useAppSelector((state) => state.subMenu.editing)
    const { name, _id, hasSubMenu } = selected
    const [, clearSelections] = useClearSelections()
    const dispatch = useAppDispatch()

    const handleCancel = useCallback(() => {
        clearSelections()
    }, [clearSelections])

    useEffect(() => {
        EventBus.on('cancel', () => {
            handleCancel()
        })
        return () => {
            EventBus.remove('cancel', handleCancel)
        }
    }, [dispatch, handleCancel])

    return (
        <Jumbotron>
            <div className="edit-content">
                <Container>
                    {message.text && <Alert color="info">{message.text}</Alert>}
                    <Media body>
                        <Media heading>
                            <div className="editHeader">
                                <span className="content-header">
                                    {name && name.toUpperCase()}
                                </span>
                                <EditDataName
                                    id={_id}
                                    currentName={name}
                                    type="classification"
                                />
                                <DeleteButton
                                    id={_id}
                                    type="classification"
                                    title="Delete"
                                />
                                {/* <ResetButton reset={reset} /> */}
                            </div>
                            <hr className="my-2" />
                        </Media>
                        {loading === 'successful' && (
                            <Container
                                fluid
                                style={{ display: 'flex', padding: '2rem' }}
                            >
                                <Button
                                    outline
                                    color="danger"
                                    onClick={handleCancel}
                                >
                                    <span>Cancel</span>
                                </Button>
                                {hasSubMenu && (
                                    <EditSubMenuContainer
                                        subMenuCount={subMenuCount}
                                        hasSubMenu={hasSubMenu}
                                    />
                                )}
                                {editing && !subMenuEditing && (
                                    <EditListItemContainer />
                                )}
                            </Container>
                        )}
                    </Media>
                </Container>
            </div>
        </Jumbotron>
    )
}

export default withRouter(Edit)
