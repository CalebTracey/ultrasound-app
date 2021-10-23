import React, { FC } from 'react'
import { Media, Jumbotron, Container } from 'reactstrap'

const ContentHome: FC = () => {
    return (
        <Jumbotron>
            <Container>
                <Media body>
                    <Media heading>
                        <p className="content___header">Welcome!</p>
                        <hr className="my-2" />
                    </Media>
                    <span className="content___text">
                        Use the sidebar to browse Ultrasound scans
                    </span>
                </Media>
            </Container>
        </Jumbotron>
    )
}
export default ContentHome
