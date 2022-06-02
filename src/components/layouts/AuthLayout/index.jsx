import { Box, Flex, useColorMode, useMediaQuery } from '@chakra-ui/react';
import classnames from 'classnames/bind';
import React from 'react';
import { withTranslation } from 'react-i18next';
import Particles from 'react-particles-js';
import DarkThemParticles from '~/assets/particles/particlesjs-config-dark-theme.json';
import LightThemParticles from '~/assets/particles/particlesjs-config-light-theme.json';
import { Header } from '~/components/common';
import styles from './AuthLayout.module.scss';

const cx = classnames.bind(styles);

const AuthLayout = (props) => {
  const { children } = props;

  const { colorMode } = useColorMode();

  //#region  responsive
  const [isLessThan767] = useMediaQuery('(max-width: 767px)');
  const [isLessThan1023] = useMediaQuery('(max-width: 1023px)');
  const [isLessThan1279] = useMediaQuery('(max-width: 1279px)');
  const [isLessThan1919] = useMediaQuery('(max-width: 1919px)');
  const [isLargerThan1025] = useMediaQuery('(min-width: 1025px)');

  const getWidth = () => {
    if (isLargerThan1025) {
      return '30%';
    } else if (isLessThan767) {
      return '90%';
    } else if (isLessThan1023) {
      return '60%';
    }
    return '40%';
  };
  const getHeight = () => {
    if (isLessThan1023) {
      return '55%';
    } else if (isLessThan1279) {
      return '40%';
    } else if (isLessThan1919) {
      return '65%';
    }
    return '70%';
  };
  //#endregion

  return (
    <Box className="wrapper" w="100vw" h="100vh" position="relative">
      <Particles params={colorMode === 'light' ? LightThemParticles : DarkThemParticles} className={cx('particles')} />
      <Box className="container" w="100%" h="100%">
        <Header/>
        <Flex
          justify="center"
          align="center"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w={getWidth()}
          minH={getHeight()}
          h="fit-content"
          background="transparent"
          backdropFilter="blur(2px)"
          border={colorMode === 'light' ? '1px solid #151111' : '1px solid #ffffff'}
          borderRadius="2rem"
          boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
          p="2rem 0"
        >
          {children}
        </Flex>
      </Box>
    </Box>
  );
};

export default withTranslation()(AuthLayout);
