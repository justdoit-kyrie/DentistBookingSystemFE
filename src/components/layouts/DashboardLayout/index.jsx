import {
  Box,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  useColorMode,
  useMediaQuery
} from '@chakra-ui/react';
import _ from 'lodash';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiBell, BiSearch } from 'react-icons/bi';
import { CgLogOut } from 'react-icons/cg';
import { FiChevronDown } from 'react-icons/fi';
import { GrLanguage } from 'react-icons/gr';
import { IoInvertMode } from 'react-icons/io5';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import i18n from '~/app/i18next';
import notFoundBG from '~/assets/images/notFound-bg.png';
import { Dropdown, Sidebar } from '~/components/common';
import { ProfileTemplate } from '~/features/Employee/Templates';
import { logoutFunc } from '~/utils';

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

const DashboardLayout = ({ t, children }) => {
  const { DROPDOWN_ITEMS } = MOCK_DATA;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchField, setSearchField] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  const [isLessThan1279] = useMediaQuery('(max-width: 1279px)');

  const tmp = _.get(MOCK_DATA, 'DROPDOWN_ITEMS[0].children.data');
  _.set(MOCK_DATA, 'DROPDOWN_ITEMS[2].onClick', () => logoutFunc({ dispatch, navigate }));
  tmp.forEach((item, idx) => {
    _.set(
      MOCK_DATA,
      `DROPDOWN_ITEMS[0].children.data[${idx}].onClick`,
      colorMode === item.label ? () => {} : toggleColorMode
    );
  });

  if (isLessThan1279)
    return (
      <Flex
        justify="center"
        align="center"
        h="100vh"
        w="100vw"
        bg={`url(${notFoundBG}) no-repeat center center`}
        bgSize="cover"
      >
        <Heading fontSize="4rem">Please use laptop for this features</Heading>
      </Flex>
    );

  return (
    <Center w="100vw" h="100vh">
      <Flex w="95vw" h="95vh" boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" borderRadius="2rem" p="2rem">
        <Sidebar />
        <Flex direction="column" flex="1" p="0 2rem">
          <Flex p="1rem 0" shrink="0">
            <InputGroup h="4rem" flex="1">
              <InputLeftElement pointerEvents="none" position="absolute" top="50%" transform="translateY(-50%)">
                <BiSearch color="#5F5D5B" fontSize="2rem" />
              </InputLeftElement>
              <Input
                h="100%"
                placeholder={t('dashboard.dentist.placeholder.search')}
                fontSize="1.6rem"
                border="none"
                _focus={{ boxShadow: 'none' }}
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
            </InputGroup>

            <Flex width="fit-content" gap="2rem" align="center" fontSize="2.5rem">
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

              <Dropdown items={DROPDOWN_ITEMS} minW="25rem">
                <ProfileTemplate icon={FiChevronDown} />
              </Dropdown>
            </Flex>
          </Flex>
          <Flex flex="1" direction="column" w="100%" h="100%" pt="1rem">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Center>
  );
};

export default withTranslation()(DashboardLayout);
