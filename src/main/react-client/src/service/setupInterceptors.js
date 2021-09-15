/* eslint-disable no-param-reassign */
import axiosInstance from './api';
import TokenService from './token-service';
import allActions from '../redux/actions';

const { getLocalAccessToken, getLocalRefreshToken, updateLocalAccessToken } =
  TokenService;

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getLocalAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) =>
      // axiosInstance.isCancel(true);
      Promise.reject(error)
  );
  const { dispatch } = store;

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig.url !== '/auth/sign-in' && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig.retry) {
          originalConfig.retry = true;
          try {
            const rs = await axiosInstance.post('/auth/token/refresh', {
              refreshToken: getLocalRefreshToken(),
            });
            const { accessToken } = rs.data;
            dispatch(allActions.auth.refreshToken(accessToken));
            updateLocalAccessToken(accessToken);
            return axiosInstance(originalConfig);
          } catch (error) {
            return Promise.reject(err);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};

export default setup;
