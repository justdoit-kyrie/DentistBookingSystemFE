/* eslint-disable no-unused-vars */
import { Box, Center, Flex, Input, InputGroup, InputLeftElement, useColorMode } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiBell, BiSearch } from 'react-icons/bi';
import { CgLogOut } from 'react-icons/cg';
import { IoInvertMode } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import { GrLanguage } from 'react-icons/gr';
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';
import i18n from '~/app/i18next';
import { Dropdown, Sidebar } from '~/components/common';
import { ProfileTemplate } from '~/features/Employee/Templates';
import _ from 'lodash';

const MOCK_DATA = {
  DROPDOWN_ITEMS: [
    {
      label: 'theme',
      icon: IoInvertMode,
      children: {
        label: 'theme',
        data: [
          {
            code: 'light',
            label: 'light',
            icon: MdOutlineLightMode,
            fw: 500,
            bg: 'colorMode'
          },
          { code: 'dark', label: 'dark', icon: MdDarkMode, fw: 500, bg: 'colorMode' }
        ]
      }
    },
    {
      label: 'language',
      icon: GrLanguage,
      children: {
        label: 'Language',
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
  ]
};

const DashboardLayout = ({ children }) => {
  const { DROPDOWN_ITEMS } = MOCK_DATA;
  const { colorMode, toggleColorMode } = useColorMode();

  const tmp = _.get(MOCK_DATA, 'DROPDOWN_ITEMS[0].children.data');
  tmp.forEach((item, idx) => {
    _.set(
      MOCK_DATA,
      `DROPDOWN_ITEMS[0].children.data[${idx}].onClick`,
      colorMode === item.label ? () => {} : toggleColorMode
    );
  });

  const [searchField, setSearchField] = useState('');

  return (
    <Center w="100vw" h="100vh">
      <Flex w="80vw" h="95vh" boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" borderRadius="2rem" p="2rem">
        <Sidebar />
        <Flex direction="column" flex="1" p="0 2rem">
          <Flex p="1rem 0" shrink="0">
            <InputGroup h="4rem" flex="0.78">
              <InputLeftElement pointerEvents="none" position="absolute" top="50%" transform="translateY(-50%)">
                <BiSearch color="#5F5D5B" fontSize="2rem" />
              </InputLeftElement>
              <Input
                h="100%"
                placeholder="Search Appointment, Patient or etc"
                fontSize="1.6rem"
                color="black"
                border="none"
                _focus={{ boxShadow: 'none' }}
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
            </InputGroup>

            <Flex flex="0.27" justify="space-between" align="center" fontSize="2.5rem">
              <Dropdown>
                <Box>
                  <AiOutlineQuestionCircle />
                </Box>
              </Dropdown>

              <Dropdown>
                <Box>
                  <BiBell />
                </Box>
              </Dropdown>

              <Dropdown items={DROPDOWN_ITEMS}>
                <ProfileTemplate icon={FiChevronDown} />
              </Dropdown>
            </Flex>
          </Flex>
          <Flex flex="1" direction="column">
            <Flex direction="column" w="100%" h="100%" pt="1rem">
              {children}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Center>
  );
};

export default DashboardLayout;
