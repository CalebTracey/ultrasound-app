import React, { Suspense } from 'react';
import SyncLoader from 'react-spinners/SyncLoader';
import { useSelector } from 'react-redux';
import { Media } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import ContentRoutes from '../../routes/ContentRoutes';

const Content = () => {
  const { selectedVideo, selectedVideoTitle } = useSelector(
    (state) => state.data
  );

  if (!selectedVideo || !selectedVideoTitle) {
    <Redirect to="/dashboard" />;
  }

  return (
    <Suspense fallback={<SyncLoader />}>
      <div className="content">
        <div className="content-wrapper">
          <div className="video-title-wrapper">
            <Media style={{ fontSize: '2vw' }} heading>
              {selectedVideoTitle}
            </Media>
          </div>
          <div className="player-wrapper">
            <ContentRoutes selectedVideo={selectedVideo} />
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default Content;
