import { Box, Button, Flex, Image, Text, useColorMode } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import _ from 'lodash';
import React, { Fragment, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { withTranslation } from 'react-i18next';
import { AiOutlineUser } from 'react-icons/ai';
import { CgLogOut } from 'react-icons/cg';
import { GrLanguage } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { LANGUAGES, LANGUAGE_KEY } from '~/app/constants';
import i18n from '~/app/i18next';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import { getLocalStorageWithoutParse } from '~/utils';
import { Dropdown, ToggleColorButton } from '..';
import DropDown from '../Dropdown';
import CountryFlag from './components/CountryFlag';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  DROPDOWN_ITEMS: [
    { label: 'View profile', icon: AiOutlineUser, to: '/profile' },
    {
      label: 'Language',
      icon: GrLanguage,
      children: {
        label: 'Language 1',
        data: [
          {
            code: 'en',
            label: 'English',
            fw: 500,
            onClick: () => i18n.changeLanguage('en')
          },
          { code: 'vi', label: 'Việt Nam', fw: 500, onClick: () => i18n.changeLanguage('vi') }
        ]
      }
    },
    { label: 'Log out', icon: CgLogOut, isBorder: true }
  ],
  NAV_ITEMS: [
    { to: '/', label: 'home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' }
  ]
};

// eslint-disable-next-line no-unused-vars
const Header = ({ t, tReady, i18n, ...passProps }) => {
  const { DROPDOWN_ITEMS, NAV_ITEMS } = MOCK_DATA;
  const { colorMode } = useColorMode();

  const [history, setHistory] = useState([{ data: DROPDOWN_ITEMS }]);
  const current = history[history.length - 1];

  const userInfo = useSelector(selectLoggedUser);

  const language = getLocalStorageWithoutParse(LANGUAGE_KEY);
  const [countryCode, setCountryCode] = useState(
    () => LANGUAGES.find((v) => v.value === language)?.countryCode || 'US'
  );

  const handleChangeMenu = (children, callback) => {
    if (typeof callback == 'function') {
      callback();
    }

    const isParent = !!children;
    if (isParent) {
      setHistory((prev) => [...prev, children]);
    }
  };

  const handleMenuHoverColor = (code) => {
    if (code === language) return {};
    const color = colorMode === 'light' ? { bg: 'grey.100' } : { bg: 'grey.400' };
    return color;
  };

  const handleBack = () => setHistory((prev) => prev.slice(0, prev.length - 1));

  const renderDropdownItem = () => {
    let unique;
    const activeItem = current.data.find((v) => v.code === language);
    if (activeItem) {
      unique = _.union([activeItem], current.data);
    } else {
      unique = current.data;
    }
    return unique.map(({ code, label, icon, children, isBorder = false, fw = 700, to = false, onClick }, index) => {
      const Icon = icon ? icon : Fragment;
      const Comp = to ? Link : Fragment;
      const compProps = {};
      const iconProps = {};
      if (to) {
        compProps.to = to;
      }
      if (icon) {
        iconProps.w = '2rem';
        iconProps.h = '2rem';
        iconProps.fontSize = '1.75rem';
      }

      return (
        <Comp key={`language - ${index}`} {...compProps}>
          <Flex
            align="center"
            gap="1rem"
            p="1rem"
            cursor="pointer"
            _hover={handleMenuHoverColor(code)}
            bg={code === language ? 'grey.100' : ''}
            borderTop={isBorder && '1px solid'}
            borderColor={isBorder && 'grey.100'}
            fontSize="1.5rem"
            onClick={() => handleChangeMenu(children, onClick)}
            color="black"
          >
            <Icon {...iconProps} />
            <Text fontWeight={fw}>{label}</Text>
          </Flex>
        </Comp>
      );
    });
  };

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
          {label}
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
          <DropDown
            placement="bottom-end"
            dropdown={renderDropdownItem()}
            label={history.length > 1 ? current.label : ''}
            onBack={handleBack}
          >
            <Image
              w="3.5rem"
              h="3.5rem"
              borderRadius="100rem"
              src="https://i.pinimg.com/236x/8f/32/4b/8f324b31c0c8aca44dfa1d33894df48c.jpg"
              cursor="pointer"
              zIndex="2"
            ></Image>
          </DropDown>
        </Flex>
      )}
      {!userInfo && (
        <Flex align="center" gap="1rem">
          <Dropdown dropdown={renderLanguages()}>
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
              fontSize="1.5rem"
            >
              Home
            </Button>
          </Link>
          <ToggleColorButton />
        </Flex>
      )}
    </Flex>
  );
};

export default withTranslation()(Header);
