/* eslint-disable react/prop-types */
import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';
// import allActions from '../../redux/actions';

const VideoPlayer = ({ selectedVideo }) => (
  // const { selectedClassification } = useSelector((state) => state.user);
  // const { selectedVideo, selectedVideoTitle } = useSelector(
  //   (state) => state.data
  // );

  // isLoading ? (
  //   'Select a video'
  // ) : (
  <>
    <ReactPlayer
      className="react-player"
      url={selectedVideo.link}
      volume={null}
      muted
      playing
      loop
      width="90%"
      height="90%"
      controls
    />
  </>
);

export default VideoPlayer;
