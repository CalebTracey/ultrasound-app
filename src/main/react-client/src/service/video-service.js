import instance from './api';

const API_URL = 'http://localhost:8080/api';

const getClassifications = () =>
  instance.get(`${API_URL}/video/classifications`);

const VideoService = { getClassifications };

export default VideoService;
