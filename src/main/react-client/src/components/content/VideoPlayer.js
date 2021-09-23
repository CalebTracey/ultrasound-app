/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';
import SyncLoader from 'react-spinners/SyncLoader';
import allActions from '../../redux/actions';

const VideoPlayer = ({ selectedVideo }) => {
  const { link } = selectedVideo;
  const dispatch = useDispatch();
  const [signedLink, setSignedLink] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (selectedVideo) {
      dispatch(allActions.data.url(link)).then((res) => {
        setSignedLink(res);
        setIsLoading(false);
      });
    }
  }, [link, dispatch, selectedVideo]);

  return isLoading && signedLink ? (
    <div className="spinner">
      <SyncLoader />
    </div>
  ) : (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        url={signedLink}
        volume={null}
        muted
        playing
        loop
        width="85%"
        height="85%"
        controls
      />
    </div>
  );
};
export default VideoPlayer;
