import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const selectedVideo = useSelector((state) => state.data.selectedVideo);

  useEffect(() => {
    if (selectedVideo) {
      setIsLoading(false);
    }
  }, [selectedVideo]);

  return isLoading ? (
    'Select a video'
  ) : (
    <div>
      <ReactPlayer url={selectedVideo.link} />
    </div>
  );
};

export default VideoPlayer;
