import { useColorMode } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

const Toast = () => {
  const { colorMode } = useColorMode();

  return (
    <ToastContainer
      theme={colorMode}
      position="top-right"
      autoClose={1000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className={cx('toast')}
    />
  );
};

export default Toast;
