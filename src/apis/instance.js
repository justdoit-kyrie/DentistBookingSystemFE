/* eslint-disable indent */
import axios from 'axios';
import { API_CODE, API_ROUTES, AUTH_KEY, history } from '~/app/constants';
import { getLocalStorage, setLocalStorage } from '~/utils';
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 1000,
  headers: { 'content-type': 'application/json' }
});

instance.interceptors.request.use(
  function (config) {
    const url = config.url;
    if (
      url.includes(API_ROUTES.login) ||
      url.includes(API_ROUTES.register) ||
      url.includes(API_ROUTES.logout) ||
      url.includes(API_ROUTES.refreshToken)
    ) {
      return config;
    }

    const { accessToken } = getLocalStorage(AUTH_KEY) || {};
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async function (response) {
    if (response && response.data) {
      const { code, message } = response.data;
      if (code && message) {
        switch (+code) {
          case API_CODE.invalidToken:
            history.replace('/login');
            break;
          case API_CODE.expiredToken:
            if (message === 'Token has expired') {
              console.log('token has expired');

              const { refreshToken } = getLocalStorage(AUTH_KEY) || {};
              const { accessToken, code, message } = await instance.post(API_ROUTES.refreshToken, { refreshToken });
              if (+code === API_CODE.OK && message === 'Generate new token successfully') {
                const config = response.config;
                setLocalStorage(AUTH_KEY, { accessToken, refreshToken });
                return await instance(config);
              } else {
                history.replace('/login');
              }
            }
            break;
        }
      }
      return response.data;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
