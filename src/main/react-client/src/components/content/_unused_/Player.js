/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect } from 'react';
// import { deserialize, serialize } from 'bson';
// import { ReactPlayer } from 'react-player';
import UploadService from '../../../service/file-service';

// const { Long } = BSON;

const { getFile } = UploadService;

const Player = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);

  // const mediaSource = new MediaSource();
  const video = document.createElement('video-player');
  video.srcObject = content;
  // HTMLMediaElement.src = content;
  useEffect(() => {
    if (!content) {
      setIsLoading(true);
      getFile('613c28e62830dd2dba8ea9fc').then((res) => {
        console.log(res);

        const { data } = res.data;
        console.log(data);
        // const bsonData = serialize(data);
        // console.log(bsonData);
        // const blobData = deserialize(Buffer.from(bsonData));
        // console.log(blobData);
        const newVideoBlob = new Blob([data.data], {
          type: 'video/mp4',
        });
        console.log(newVideoBlob);
        const url = window.URL.createObjectURL(newVideoBlob);
        // const mediaStream = new MediaStream();
        // // mediaStream.
        // const video = document.getElementById('video-player');
        // video.srcObject = new MediaStream(newVideoBlob.data);

        // const data = serialize(res.data.data);
        // console.log(data);
        // const deserial = deserialize(Buffer.from(data));
        // console.log(deserial);
        // const blob = new Blob([deserial], { type: 'video/mp4' });
        // console.log(url);
        setContent(url);
      });
    }
    setIsLoading(false);
    // return () => ;
  }, [content]);
  // console.log(file);
  console.log(content);
  return isLoading ? (
    'Loading...'
  ) : (
    <div>
      <video
        id="video-player"
        controls
        loop
        autoPlay
        muted
        // type="video/mp4"
      />
      {/* <ReactPlayer src={content} /> */}
    </div>
  );
};
export default Player;
