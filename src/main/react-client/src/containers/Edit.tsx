/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState, FC, useCallback, useMemo } from 'react'
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { Media, Jumbotron, Container, Alert } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import EditSubMenuContainer from '../components/edit/EditSubMenuContainer'
import EditItemListContainer from '../components/edit/EditItemListContainer'
import EditDataName from '../components/edit/EditDataName'
import allActions from '../redux/actions'
import DeleteButton from '../components/buttons/DeleteButton'
import EventBus from '../common/EventBus'
// import editSlice from '../redux/slices/edit'

interface IListItem {
    name: string
    title: string
    link: string
}
interface ISubMenu {
    key: string
    value: string
}
interface IClassification {
    _id: string
    name: string
    hasSubMenu: boolean
    listItems: IListItem[]
    subMenus: { [key: string]: ISubMenu }
}
interface Props {
    history: RouteComponentProps['history']
}

const Edit: FC<Props> = ({ history }) => {
    const { roles } = useAppSelector((state) => state.auth.user)
    const { message } = useAppSelector((state) => state.message)
    const { selectedEdit } = useAppSelector((state) => state.data)
    const { classifications } = useAppSelector((state) => state.data)
    const { editingListItem, editingSubMenu } = useAppSelector(
        (state) => state.edit
    )
    const [editState, setEditState] = useState(selectedEdit)
    const { _id, name, subMenus, listItems, hasSubMenu } = selectedEdit
    const dispatch = useAppDispatch()

    const handleCancel = useCallback(() => {
        dispatch(allActions.data.clearSelectedSubMenu())
    }, [dispatch])

    const updateData = useCallback(() => {
        dispatch(allActions.data.selectedEdit(editState))
    }, [dispatch, editState])

    useEffect(() => {
        history.listen((location) => {
            handleCancel()
        })
    }, [dispatch, history, handleCancel])

    return roles.includes('ROLE_ADMIN') && name !== undefined ? (
        <Jumbotron>
            <div className="edit-content">
                <Container>
                    {message !== '' && <Alert color="info">{message}</Alert>}
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
                            {!editingListItem && <EditSubMenuContainer />}
                            {!editingSubMenu && <EditItemListContainer />}
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
