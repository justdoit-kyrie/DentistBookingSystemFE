import { Avatar, Box, Button, Flex, Text, useColorMode } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import _ from 'lodash';
import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { withTranslation } from 'react-i18next';
import { AiOutlineHistory, AiOutlineUser } from 'react-icons/ai';
import { CgLogOut } from 'react-icons/cg';
import { GrLanguage } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LANGUAGES, LANGUAGE_KEY } from '~/app/constants';
import i18n from '~/app/i18next';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import { getLocalStorageWithoutParse, logoutFunc } from '~/utils';
import { Dropdown, ToggleColorButton } from '..';
import DropDown from '../Dropdown';
import CountryFlag from './components/CountryFlag';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  DROPDOWN_ITEMS: [
    { icon: AiOutlineUser, to: '/profile', label: 'profile' },
    { icon: AiOutlineHistory, to: '/bookingHistory', label: 'bookingHistory' },
    {
      label: 'language',
      icon: GrLanguage,
      children: {
        label: 'Language 1',
        data: [
          {
            code: 'en',
            label: 'en',
            fw: 500,
            onClick: () => i18n.changeLanguage('en')
          },
          { code: 'vi', label: 'vi', fw: 500, onClick: () => i18n.changeLanguage('vi') }
        ]
      }
    },
    { icon: CgLogOut, isBorder: true, label: 'logout' }
  ],
  NAV_ITEMS: [
    { to: '/', label: 'home' },
    { to: '/about', label: 'about' },
    { to: '/services', label: 'services' },
    { to: '/doctors', label: 'doctors' },
    { to: '/blog', label: 'blog' },
    { to: '/contact', label: 'contact' }
  ]
};

// eslint-disable-next-line no-unused-vars
const Header = ({ t, tReady, i18n, ...passProps }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  _.set(MOCK_DATA, 'DROPDOWN_ITEMS[3].onClick', () => logoutFunc({ dispatch, navigate }));
  const { DROPDOWN_ITEMS, NAV_ITEMS } = MOCK_DATA;
  const { colorMode } = useColorMode();

  const userInfo = useSelector(selectLoggedUser);

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

  const renderNavItems = () =>
    NAV_ITEMS.map(({ to, label }, index) => (
      <NavLink key={`${index}`} className={(v) => cx('nav-item', { active: v.isActive })} to={to}>
        <Button variant="default" color="inherit" fontSize="1.5rem" fontWeight="500">
          {t(`home.header.nav.${label}`)}
        </Button>
      </NavLink>
    ));

  return (
    <Flex justify="space-between" align="center" p="2rem 0 1rem" position="relative" zIndex="3" {...passProps}>
      <Link to="/" className={cx('logo')}>
        <Text as="span">DENTA</Text>
        <Text as="span" fontWeight="700">
          CARE
        </Text>
      </Link>
      {userInfo && (
        <Flex gap="2rem" align="center">
          <Flex gap="2rem">{renderNavItems()}</Flex>
          <DropDown placement="bottom-end" items={DROPDOWN_ITEMS}>
            <Avatar
              w="3.5rem"
              h="3.5rem"
              borderRadius="100rem"
              name={`${userInfo.firstName} ${userInfo.lastName}`}
              src={userInfo.imageUrl}
              cursor="pointer"
              zIndex="2"
            />
          </DropDown>
          <ToggleColorButton />
        </Flex>
      )}
      {!userInfo && (
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
          <Link to="/register">
            <Button variant="default" h="auto" fontSize="1.5rem">
              {t('auth.login.signUp')}
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
              fontSize="1.5rem"
            >
              {t('auth.login.home')}
            </Button>
          </Link>
          <ToggleColorButton />
        </Flex>
      )}
    </Flex>
  );
};

export default withTranslation()(Header);
