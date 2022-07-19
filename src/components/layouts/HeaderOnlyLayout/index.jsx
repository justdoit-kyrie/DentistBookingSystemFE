import { Box, Flex, Link, Text, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { withTranslation } from 'react-i18next';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { LANGUAGES, LANGUAGE_KEY } from '~/app/constants';
import { Dropdown, ToggleColorButton } from '~/components/common';
import CountryFlag from '~/components/common/Header/components/CountryFlag';
import { getLocalStorageWithoutParse } from '~/utils';
import i18n from '~/app/i18next';
import './HeaderOnlyLayout.scss';
import styles from './HeaderOnlyLayout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const headerOnlyLayout = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const language = getLocalStorageWithoutParse(LANGUAGE_KEY);
  const [countryCode, setCountryCode] = useState(
    () => LANGUAGES.find((v) => v.value === language)?.countryCode || 'US'
  );

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
          <Text as="span" textTransform="capitalize" fontSize="1.5rem">
            {label}
          </Text>
        </Flex>
      );
    });

  return (
    <Box className="Wrapper" w="100%" h="100%" boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px">
      <Box className="container" w="100%" h="100%">
        <Flex justify="space-between" align="center" p="2.5rem 0 2.5rem 0" gap="2">
          <Flex>
            <BsArrowLeftCircle
              onClick={() => navigate('/')}
              fontSize="2.5rem"
              fontWeight="bold"
              className="back-arrow"
            />
            <Link to="/" className={cx('logo')} onClick={() => navigate('/')}>
              <Text as="span">DENTA</Text>
              <Text as="span" fontWeight="700">
                CARE
              </Text>
            </Link>
          </Flex>
          <Flex align="center" gap="1rem">
            <Dropdown dropdown={renderLanguages()} bg={colorMode === 'light' ? 'white' : 'navy-500'}>
              <CountryFlag
                countryCode={countryCode}
                w="3rem"
                h="3rem"
                borderRadius="100rem"
                overflow="hidden"
                className={cx('flag-icon')}
              />
            </Dropdown>

            <ToggleColorButton />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default withTranslation()(headerOnlyLayout);
