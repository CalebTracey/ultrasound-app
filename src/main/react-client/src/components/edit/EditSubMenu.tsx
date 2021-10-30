/* eslint-disable no-underscore-dangle */
import React, { FC } from 'react'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Jumbotron,
    Container,
} from 'reactstrap'
import EditDataName from './EditDataName'
import DeleteButton from '../buttons/DeleteButton'
import EditListItemContainer from './EditListItemContainer'
import { useAppSelector } from '../../redux/hooks'

const EditSubMenu: FC = () => {
    const { selected } = useAppSelector((state) => state.subMenu)
    const classificationId = useAppSelector(
        (state) => state.classification.selected._id
    )
    const { _id, name } = selected

    return (
        <div className="edit___content">
            <Jumbotron fluid>
                <Container
                    fluid
                    style={{
                        flexDirection: 'column',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div className="edit___item">
                        <Container className="edit___text-wrap">
                            <span className="span-header___capital___light">
                                Sub Menu:{' '}
                            </span>
                            <span className="span-header___capital">
                                {`"${name}"`}
                            </span>
                            <DeleteButton
                                id={`${classificationId}/${_id}`}
                                type="subMenu"
                                title="Delete"
                            />
                        </Container>
                        <br />
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>Edit Title</InputGroupText>
                            </InputGroupAddon>
                            <EditDataName
                                id={`${classificationId}/${_id}`}
                                type="subMenu"
                                currentName={name}
                            />
                        </InputGroup>
                    </div>
                    <EditListItemContainer />
                </Container>
            </Jumbotron>
        </div>
    )
}

export default EditSubMenu
