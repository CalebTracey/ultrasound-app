import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from 'antd';
import VideoPlayer from './VideoPlayer';
import allActions from '../../redux/actions';

const Content = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const [videoTitle, setVideoTitle] = useState('');
  const { selectedClassification, subMenu, selectedVideo, selectedVideoTitle } =
    useSelector((state) => state.user);
  const { name } = selectedVideo;

  // const { data } = subMenu;
  // const subMenuName = subMenu.data.name;
  const dispatch = useDispatch();
  // const [videoTitle, setVideoTitle] = useState('');

  useEffect(() => {
    if (selectedClassification && subMenu.data && name) {
      dispatch(
        allActions.user.videoTitle(
          `${selectedClassification.name} - ${subMenu.data.name} - ${name}`
        )
      );
    } else if (selectedClassification && name) {
      dispatch(
        allActions.user.videoTitle(`${selectedClassification.name} - ${name}`)
      );
    } else if (!selectedClassification.hasSubMenu && name) {
      dispatch(
        allActions.user.videoTitle(`${selectedClassification.name} - ${name}`)
      );
    }
  }, [name, selectedClassification, subMenu, dispatch]);

  return (
    <div className="content">
      <div className="content-wrapper">
        <div className="video-title-wrapper">
          <Typography.Title>{selectedVideoTitle}</Typography.Title>
        </div>
        <div className="player-wrapper">
          <VideoPlayer selectedVideo={selectedVideo} />
        </div>
      </div>
    </div>
  );
};
export default Content;
