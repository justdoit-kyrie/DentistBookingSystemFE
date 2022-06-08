/* eslint-disable no-unused-vars */
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import _ from 'lodash';
import React, { Fragment } from 'react';
import { AiOutlineCalendar, AiOutlineFileText, AiOutlineSetting } from 'react-icons/ai';
import { BiMessageRounded } from 'react-icons/bi';
import { BsGrid } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import LOGO from '~/assets/images/logo.png';
import { getDestinationURL } from '~/utils';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  menu: [
    {
      list: [
        {
          icon: BsGrid,
          label: 'overview',
          to: getDestinationURL('overview')
        },
        {
          icon: AiOutlineCalendar,
          label: 'appointment',
          to: getDestinationURL('appointment')
        },
        {
          icon: FiUser,
          label: 'my patients',
          to: getDestinationURL('myPatients')
        },
        {
          icon: BiMessageRounded,
          label: 'message',
          to: getDestinationURL('message')
        },
        {
          icon: AiOutlineFileText,
          label: 'blog',
          to: getDestinationURL('blog')
        }
      ]
    },
    {
      title: 'account pages',
      list: [
        {
          icon: AiOutlineSetting,
          label: 'profile',
          to: getDestinationURL('profile')
        },
        {
          icon: CgProfile,
          label: 'setting',
          to: getDestinationURL('setting')
        }
      ]
    }
  ]
};

const Sidebar = () => {
  const { menu } = MOCK_DATA;

  return (
    <Flex
      flex="0.3"
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
                <Heading textTransform="uppercase" mt="2rem">
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
                      className={({ isActive }) => (isActive ? cx('link', 'active') : cx('link'))}
                    >
                      <Flex
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

export default Sidebar;
