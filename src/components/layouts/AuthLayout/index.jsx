import { Box, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LANGUAGES } from '~/app/constants';
import { Dropdown } from '~/components/common';
import classnames from 'classnames/bind';
import styles from './AuthLayout.module.scss';
import { LANGUAGE_KEY } from '~/app/routes';
import { getLocalStorageWithoutParse } from '~/utils';
import { motion } from 'framer-motion';
import BG from '~/assets/images/login-bg.jpg';

const cx = classnames.bind(styles);

const AuthLayout = (props) => {
  const { i18n, children } = props;
  const [countryCode, setCountryCode] = useState(
    LANGUAGES.find((v) => v.value === getLocalStorageWithoutParse(LANGUAGE_KEY)).countryCode
  );

  const renderLanguages = () =>
    LANGUAGES.map(({ label, icon, value, countryCode }, index) => {
      const IconComp = icon;
      return (
        <Flex
          key={`language - ${index}`}
          align="center"
          gap="0.5rem"
          p="1rem"
          cursor="pointer"
          _hover={{ bg: 'grey.100' }}
          onClick={() => {
            i18n.changeLanguage(value);
            setCountryCode(countryCode);
          }}
        >
          <IconComp />
          <Text as="span" textTransform="capitalize">
            {label}
          </Text>
        </Flex>
      );
    });

  return (
    <Box className="wrapper" w="100vw" h="100vh" bg={`url('${BG}') no-repeat center center`}>
      <Box className="container" w="100%" h="100%">
        <Flex justify="space-between" align="center" pt="2rem" background="transparent">
          <h1>Logo</h1>
          <Flex align="center" gap="1rem">
            <Box>
              <Dropdown dropdown={renderLanguages()}>
                <div className={cx('flag')}>
                  <ReactCountryFlag
                    countryCode={countryCode}
                    svg
                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                    cdnSuffix="svg"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
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
          </Flex>
        </Flex>
        <Flex
          justify="center"
          align="center"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          minW="28vw"
          minH="60vh"
          background="white"
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
