import React from 'react'
import { Media, Jumbotron, Container } from 'reactstrap'

const ContentHome = (): JSX.Element => {
    return (
        <Jumbotron>
            <Container>
                <Media body>
                    <Media heading>
                        <p className="display-6">Welcome!</p>
                        <hr className="my-2" />
                    </Media>
                    <p className="lead">
                        Utilize the sidebar to browse Ultrasound clips
                    </p>
                </Media>
            </Container>
        </Jumbotron>
    )
}
export default ContentHome
