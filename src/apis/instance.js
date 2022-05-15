import axios from 'axios';
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 1000,
  headers: { 'content-type': 'application/json' }
});

instance.interceptors.request.use(
  function (config) {
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
