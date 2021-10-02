/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, FC, useCallback } from 'react'
import { withRouter, Redirect, RouteComponentProps } from 'react-router-dom'
import { Media, Jumbotron, Container, Alert } from 'reactstrap'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import EditSubMenuContainer from '../components/edit/EditSubMenuContainer'
import EditItemListContainer from '../components/edit/EditItemListContainer'
import EditDataName from '../components/edit/EditDataName'
import allActions from '../redux/actions'

interface IState {
    listItem: {
        name: string
        title: string
        link: string
    }
    subMenu: {
        key: string
        value: string
    }
}

interface Props {
    history: RouteComponentProps['history']
}

const Edit: FC<Props> = ({ history }) => {
    const { roles } = useAppSelector((state) => state.auth.user)
    const messageState = useAppSelector((state) => state.message)
    const { selectedEdit } = useAppSelector((state) => state.data)
    const { _id, name, subMenus, listItems, hasSubMenu } = selectedEdit
    const [listItemSelection, setListItemSelection] = useState<
        IState['listItem'] | undefined
    >(undefined)
    const [editingSubMenu, setEditingSubMenu] = useState(false)
    // const { message } = messageState
    const dispatch = useAppDispatch()

    const handleCancel = useCallback(() => {
        dispatch(allActions.data.clearSelectedSubMenu())
        setEditingSubMenu(false)
    }, [dispatch])

    useEffect(() => {
        history.listen((location) => {
            handleCancel()
        })
    }, [dispatch, history, handleCancel])

    return roles.includes('ROLE_ADMIN') && selectedEdit.name !== undefined ? (
        <Jumbotron>
            <div className="edit-content">
                <Container>
                    {/* {message.message !== '' && (
                        <Alert color="info">{message.message}</Alert>
                    )} */}
                    <Media body>
                        <h4 className="lead">Editing:</h4>
                        <Media heading>
                            <div style={{ display: 'flex' }}>
                                <span className="display-4">
                                    {selectedEdit.name.toUpperCase()}
                                </span>
                                <EditDataName
                                    id={_id}
                                    currentName={name}
                                    type="classification"
                                />
                                {/* <ResetButton reset={reset} /> */}
                            </div>
                            <hr className="my-2" />
                        </Media>
                        <Container
                            fluid
                            style={{ display: 'flex', padding: '2rem' }}
                        >
                            <EditSubMenuContainer
                                // setSubMenuSelection={setSubMenuSelection}
                                handleCancel={handleCancel}
                                editingSubMenu={editingSubMenu}
                                setEditingSubMenu={setEditingSubMenu}
                                hasSubMenu={hasSubMenu}
                                subMenus={subMenus}
                                classificationId={_id}
                            />
                            {!editingSubMenu && (
                                <EditItemListContainer
                                    listItems={listItems}
                                    setListItemSelection={setListItemSelection}
                                    // subMenuSelection={subMenuSelection}
                                />
                            )}
                            <Media body>
                                <Container fluid style={{ padding: '2rem' }}>
                                    {/* <EditForm
                                        successful={successful}
                                        message={message}
                                        onSubmit={onSubmit}
                                        errors={errors}
                                        register={register}
                                        handleSubmit={handleSubmit}
                                        reset={reset}
                                    /> */}
                                </Container>
                            </Media>
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
