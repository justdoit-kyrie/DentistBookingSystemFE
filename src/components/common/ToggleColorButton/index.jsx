import { Switch, Tooltip, useColorMode } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import styles from './ToggleColorButton.module.scss';
const cx = classNames.bind(styles);

const ToggleColorButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Tooltip
        offset={[0, 10]}
        fontSize="1.2rem"
        placement="bottom"
        textTransform="capitalize"
        shouldWrapChildren
        closeOnClick={false}
        label={colorMode}
        hasArrow
      >
        <Switch
          isChecked={colorMode === 'dark' ? true : false}
          size="lg"
          colorScheme="purple"
          onChange={toggleColorMode}
        />
      </Tooltip>
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
    </>
  );
};

export default ToggleColorButton;
