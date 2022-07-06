import { Box, Flex, Heading, Image, Text, useColorMode, useMediaQuery } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { AiOutlineCalendar, AiOutlineSetting } from 'react-icons/ai';
import { BsGrid } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { RiBuilding2Line } from 'react-icons/ri';
import { MdOutlineMedicalServices } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LOGO from '~/assets/images/logo.png';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import { getDestinationURL } from '~/utils';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = (t) => ({
  docter: [
    {
      list: [
        {
          icon: BsGrid,
          label: t('dashboard.dentist.sidebar.overview'),
          to: getDestinationURL('overview')
        },
        {
          icon: AiOutlineCalendar,
          label: t('dashboard.dentist.sidebar.appointment'),
          to: getDestinationURL('appointment')
        },
        {
          icon: AiOutlineSetting,
          label: t('dashboard.dentist.sidebar.profile'),
          to: getDestinationURL('profile')
        }
      ]
    }
  ],
  admin: [
    {
      list: [
        {
          icon: BsGrid,
          label: 'appointment',
          to: getDestinationURL('appointments')
        },
        {
          icon: FiUsers,
          label: 'users',
          to: getDestinationURL('users')
        },
        {
          icon: FiUsers,
          label: 'dentists',
          to: getDestinationURL('dentists')
        },
        {
          icon: RiBuilding2Line,
          label: 'clinics',
          to: getDestinationURL('clinics')
        },
        {
          icon: MdOutlineMedicalServices,
          label: 'services',
          to: getDestinationURL('services')
        }
      ]
    },
    {
      title: 'Account page',
      list: [
        {
          icon: AiOutlineSetting,
          label: 'profile',
          to: getDestinationURL('profile')
        }
      ]
    }
  ]
});

const Sidebar = ({ t }) => {
  const userInfo = useSelector(selectLoggedUser) || { role: 'admin' };
  const menu = MOCK_DATA(t)[userInfo.role.toLowerCase()];

  const { colorMode } = useColorMode();
  const [isLessThan1919] = useMediaQuery('(max-width: 1919px)');

  return (
    <Flex
      flex={isLessThan1919 ? '0.25' : '0.2'}
      boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      borderRadius="inherit"
      p="2rem"
      direction="column"
      justify="flex-start"
    >
      <Flex
        fontSize="1.5rem"
        borderBottom="1px solid"
        borderColor="grey.100"
        pb="1.5rem"
        justifyContent="center"
        align="center"
        gap="0.5rem"
        shrink="0"
      >
        <Box boxSize="2.5rem">
          <Image src={LOGO} />
        </Box>
        <Heading textTransform="capitalize" fontSize="inherit">
          dentacare.
        </Heading>
      </Flex>
      <Flex flex="1" direction="column" gap="2rem" mt="5rem">
        {menu.map(({ list, title }, index) => {
          return (
            <Fragment key={`${index}`}>
              {title && (
                <Heading
                  sx={{
                    '@media screen and (max-width: 1439px)': {
                      fontSize: '1.5rem'
                    }
                  }}
                  textTransform="uppercase"
                  mt="2rem"
                >
                  {title}
                </Heading>
              )}
              <Flex direction="column">
                {list.map(({ label, icon, to }, index) => {
                  const IconComp = icon;
                  return (
                    <NavLink
                      key={`${index}`}
                      to={to}
                      className={({ isActive }) =>
                        cx('link', {
                          active: isActive,
                          dark: colorMode === 'dark'
                        })
                      }
                    >
                      <Flex
                        sx={{
                          '@media screen and (max-width: 1439px)': {
                            fontSize: '1.5rem'
                          }
                        }}
                        gap="1rem"
                        align="center"
                        justify="flex-start"
                        fontSize="1.75rem"
                        p="2rem 1rem"
                        color="inherit"
                        cursor="pointer"
                        fontWeight={500}
                      >
                        <IconComp fontSize="2rem" />
                        <Text textTransform="capitalize">{label}</Text>
                      </Flex>
                    </NavLink>
                  );
                })}
              </Flex>
            </Fragment>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default withTranslation()(Sidebar);
