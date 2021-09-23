import React from 'react';
import { useSelector } from 'react-redux';
import { Media, Jumbotron, Container } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import ContentRoutes from '../../routes/ContentRoutes';

const Content = () => {
  const { selectedVideo, selectedVideoTitle, selectedVideoUrl } = useSelector(
    (state) => state.data
  );

  if (!selectedVideo || !selectedVideoTitle) {
    <Redirect to="/dashboard" />;
  }

  return (
    <div className="content">
      <div className="content-wrapper">
        <Jumbotron fluid style={{ maxHeight: '80vh', paddingTop: '2rem' }}>
          <Container fluid>
            <div className="video-title-wrapper">
              <Media style={{ fontSize: '2vw' }} heading>
                {selectedVideoTitle}
              </Media>
            </div>
            <Container fluid>
              <ContentRoutes
                selectedVideo={selectedVideo}
                selectedVideoList={selectedVideoUrl}
              />
            </Container>
          </Container>
        </Jumbotron>
      </div>
    </div>
  );
};
export default Content;
