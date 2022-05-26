import axios from 'axios';
import { API_ROUTES, AUTH_KEY } from '~/app/constants';
import { getLocalStorage } from '~/utils';
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 1000,
  headers: { 'content-type': 'application/json' }
});

instance.interceptors.request.use(
  function (config) {
    const url = config.url;
    if (url.includes(API_ROUTES.login) || url.includes(API_ROUTES.register) || url.includes(API_ROUTES.logout)) {
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
  function (response) {
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
