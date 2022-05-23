import { Box, Button, Flex, Text, useColorMode, useMediaQuery } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LANGUAGES } from '~/app/constants';
import { LANGUAGE_KEY } from '~/app/routes';
import { Dropdown, ToggleColorButton } from '~/components/common';
import { getLocalStorageWithoutParse } from '~/utils';
import CountryFlag from './components/CountryFlag';
import LightThemParticles from '~/assets/particles/particlesjs-config-light-theme.json';
import DarkThemParticles from '~/assets/particles/particlesjs-config-dark-theme.json';
import Particles from 'react-particles-js';
import styles from './AuthLayout.module.scss';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const AuthLayout = (props) => {
  const { i18n, children } = props;
  const [countryCode, setCountryCode] = useState(
    LANGUAGES.find((v) => v.value === getLocalStorageWithoutParse(LANGUAGE_KEY)).countryCode
  );
  const { colorMode } = useColorMode();

  //#region  reponsive
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

  const renderLanguages = () =>
    LANGUAGES.map(({ label, value, countryCode }, index) => {
      return (
        <Flex
          key={`language - ${index}`}
          align="center"
          gap="0.5rem"
          p="1rem"
          cursor="pointer"
          _hover={{ bg: colorMode === 'light' ? 'grey.100' : 'grey.400' }}
          onClick={() => {
            i18n.changeLanguage(value);
            setCountryCode(countryCode);
          }}
        >
          <CountryFlag countryCode={countryCode} w="2rem" h="2rem" borderRadius="100rem" overflow="hidden" />
          <Box>
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
              cdnSuffix="svg"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Box>
          <Text as="span" textTransform="capitalize">
            {label}
          </Text>
        </Flex>
      );
    });

  return (
    <Box className="wrapper" w="100vw" h="100vh" position="relative">
      <Particles params={colorMode === 'light' ? LightThemParticles : DarkThemParticles} className={cx('particles')} />
      <Box className="container" w="100%" h="100%">
        <Flex justify="space-between" align="center" pt="2rem" background="transparent">
          <h1>Logo</h1>
          <Flex align="center" gap="1rem">
            <Box>
              <Dropdown dropdown={renderLanguages()}>
                <CountryFlag
                  countryCode={countryCode}
                  w="2rem"
                  h="2rem"
                  borderRadius="100rem"
                  overflow="hidden"
                  className={cx('flag-icon')}
                />
              </Dropdown>
            </Box>

            <Link to="/register">
              <Button variant="default" h="auto" _hover={{ textDecor: 'underline' }}>
                sign up
              </Button>
            </Link>
            <Link to="/">
              <Button
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variant="primary"
                size="lg"
                h="auto"
              >
                Home
              </Button>
            </Link>
            <ToggleColorButton />
          </Flex>
        </Flex>
        <Flex
          justify="center"
          align="center"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w={getWidth()}
          h={getHeight()}
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
