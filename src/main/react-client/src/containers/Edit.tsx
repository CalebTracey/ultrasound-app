/* eslint-disable no-underscore-dangle */
import React, { useEffect, FC, useCallback } from 'react'
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { Media, Jumbotron, Container, Alert } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import EditSubMenuContainer from '../components/edit/EditSubMenuContainer'
import EditItemListContainer from '../components/edit/EditListItemContainer'
import EditDataName from '../components/edit/EditDataName'
import DeleteButton from '../components/buttons/DeleteButton'
import useClearSelections from '../hooks/useClearSelections'

interface Props {
    history: RouteComponentProps['history']
}

const Edit: FC<Props> = ({ history }) => {
    const roles = useAppSelector((state) => state.auth.user?.roles)
    const { message } = useAppSelector((state) => state)
    const { selected, subMenuCount } = useAppSelector(
        (state) => state.classification
    )
    const { subMenus, listItems } = useAppSelector(
        (state) => state.classification.selected
    )
    const editingListItem = useAppSelector((state) => state.item.editing)
    const [cleared, clearSelections] = useClearSelections()
    const { _id, name, hasSubMenu } = selected
    const dispatch = useAppDispatch()

    const handleCancel = useCallback(() => {
        // clearSelections()
    }, [clearSelections])

    // const updateData = useCallback(() => {
    //     dispatch(allActions.data.selectedEdit(editState))
    // }, [dispatch, editState])

    useEffect(() => {
        history.listen((location) => {
            handleCancel()
        })
    }, [dispatch, history, handleCancel])

    return roles && roles.includes('ROLE_ADMIN') && name !== undefined ? (
        <Jumbotron>
            <div className="edit-content">
                <Container>
                    {message.text && <Alert color="info">{message.text}</Alert>}
                    <Media body>
                        <h4 className="lead">Editing:</h4>
                        <Media heading>
                            <div style={{ display: 'flex' }}>
                                <span className="display-4">
                                    {name.toUpperCase()}
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
                        <Container
                            fluid
                            style={{ display: 'flex', padding: '2rem' }}
                        >
                            {subMenus && (
                                <EditSubMenuContainer
                                    subMenuCount={subMenuCount}
                                    hasSubMenu={hasSubMenu}
                                />
                            )}
                            {listItems && <EditItemListContainer />}
                        </Container>
                    </Media>
                </Container>
            </div>
        </Jumbotron>
    ) : (
        <Redirect
            to={{
                pathname: '/dashboard',
                state: history.location,
            }}
        />
    )
}

export default withRouter(Edit)
