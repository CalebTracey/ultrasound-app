import React, { FC } from 'react'
import { Media, Jumbotron, Container } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import ContentRoutes from '../../routes/ContentRoutes'
import { useAppSelector } from '../../redux/hooks'

const Content: FC = () => {
    const { selected, editing } = useAppSelector((state) => state.item)

    if (!selected || editing) {
        ;<Redirect to="/dashboard" />
    }

    return (
        <div className="content">
            <div className="content-wrapper">
                <Jumbotron
                    fluid
                    style={{ maxHeight: '80vh', paddingTop: '2rem' }}
                >
                    <Container fluid>
                        <div className="video-title-wrapper">
                            <Media style={{ fontSize: '2vw' }} heading>
                                {selected.title}
                            </Media>
                        </div>
                        <Container fluid>
                            <ContentRoutes />
                        </Container>
                    </Container>
                </Jumbotron>
            </div>
        </div>
    )
}
export default Content
