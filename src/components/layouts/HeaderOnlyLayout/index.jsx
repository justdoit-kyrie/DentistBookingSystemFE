import { Avatar, Box, Button, Flex, Link, Text } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { AiOutlineHistory, AiOutlineUser } from 'react-icons/ai';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { CgLogOut } from 'react-icons/cg';
import { GrLanguage } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import i18n from '~/app/i18next';
import { Dropdown, ToggleColorButton } from '~/components/common';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import { logoutFunc } from '~/utils';
import styles from './HeaderOnlyLayout.module.scss';
import './HeaderOnlyLayout.scss';

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

const headerOnlyLayout = ({ t }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  _.set(MOCK_DATA, 'DROPDOWN_ITEMS[3].onClick', () => logoutFunc({ dispatch, navigate }));
  const { DROPDOWN_ITEMS, NAV_ITEMS } = MOCK_DATA;

  const userInfo = useSelector(selectLoggedUser);

  const renderNavItems = () =>
    NAV_ITEMS.map(({ to, label }, index) => (
      <NavLink key={`${index}`} className={(v) => cx('nav-item', { active: v.isActive })} to={to}>
        <Button variant="default" color="inherit" fontSize="1.5rem" fontWeight="500">
          {t(`home.header.nav.${label}`)}
        </Button>
      </NavLink>
    ));

  return (
    <Box className="Wrapper" w="100%" h="100%" boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px">
      <Box className="container" w="100%" h="100%">
        <Flex justify="space-between" align="center" p="2.5rem 0 2.5rem 0" gap="2">
          <Flex>
            <BsArrowLeftCircle
              onClick={() => navigate(-1)}
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

          {userInfo && (
            <Flex gap="2rem" align="center">
              <Flex gap="2rem">{renderNavItems()}</Flex>
              <Dropdown placement="bottom-end" items={DROPDOWN_ITEMS}>
                <Avatar
                  w="3.5rem"
                  h="3.5rem"
                  borderRadius="100rem"
                  name={`${userInfo.firstName} ${userInfo.lastName}`}
                  src={userInfo.imageUrl}
                  cursor="pointer"
                  zIndex="2"
                ></Avatar>
              </Dropdown>
              <ToggleColorButton />
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default withTranslation()(headerOnlyLayout);
