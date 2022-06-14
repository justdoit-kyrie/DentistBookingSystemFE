/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  Heading,
  Image,
  Square,
  Text,
  useColorMode,
  useMediaQuery
} from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiOutlineCalendar, AiOutlineClose, AiOutlineVideoCamera } from 'react-icons/ai';
import { BsBuilding, BsCheck } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { ProfileTemplate } from '../../Templates';
import { Wrapper } from './components';
import styles from './OverView.module.scss';
import './Overview.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = (t) => ({
  statistic: [
    {
      icon: AiOutlineCalendar,
      number: 24.4,
      desc: t('dashboard.dentist.features.0.label'),
      bg: 'purple.500'
    },
    {
      icon: FiUser,
      number: 166.3,
      desc: t('dashboard.dentist.features.1.label'),
      bg: 'red.500'
    },
    {
      icon: BsBuilding,
      number: 53.5,
      desc: t('dashboard.dentist.features.2.label'),
      bg: 'yellow.500'
    },
    {
      icon: AiOutlineVideoCamera,
      number: 28.0,
      desc: t('dashboard.dentist.features.3.label'),
      bg: 'primary.300'
    }
  ],
  week: ['s', 'm', 't', 'w', 't', 'f', 's'],
  dataTable: [
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    },
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'Out-Patient'
    }
  ]
});

const OverViewPage = ({ t }) => {
  const { statistic, week, dataTable } = MOCK_DATA(t);

  const [date, setDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState();
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  const { colorMode } = useColorMode();

  useEffect(() => {
    const day = date.getDate();
    const week = date.getDay();
    console.log({ day, week });

    let prevDay = week === 0 ? day : day - week;
    let nextDay = week === 6 ? day : day + (6 - week);

    setMinDate((prev) => {
      prev.setDate(prevDay);
      return new Date(prev);
    });
    setMaxDate((prev) => {
      prev.setDate(nextDay);
      return new Date(prev);
    });
  }, [date]);

  const handleSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
  };

  const renderDropdown = () => {};

  const patientNameTemplate = ({
    name,
    image = 'https://images.unsplash.com/photo-1654552643262-192b454c5c62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
  }) => {
    return (
      <Flex gap="1rem" align="center">
        <Circle size="3rem" overflow="hidden">
          <Image src={image} />
        </Circle>
        <Text fontWeight="500" color={colorMode === 'light' ? 'grey.300' : 'white'} fontSize="1.4rem">
          {name}
        </Text>
      </Flex>
    );
  };

  const bodyDataTableTemplate = (value) => <Text color={colorMode === 'light' ? 'grey.300' : 'white'}>{value}</Text>;

  return (
    <>
      <Flex direction="column" gap="1rem" fontSize="1.3rem">
        <Heading textTransform="capitalize">{t('dashboard.dentist.header.title', { name: 'stephen' })}</Heading>
        <Text color="grey.300" fontWeight="500">
          {t('dashboard.dentist.header.desc')}
        </Text>
      </Flex>

      <Flex gap="2rem" mt="2rem">
        {statistic.map(({ icon, number, desc, bg }, index) => {
          const IconComp = icon;
          return (
            <Flex
              sx={{
                '@media screen and (max-width: 1439px)': {
                  p: '1rem'
                }
              }}
              flex="1"
              key={`${index}`}
              gap="2rem"
              bg={bg}
              p="1.5rem 2rem"
              align="center"
              borderRadius="1.2rem"
            >
              <Circle
                sx={{
                  '@media screen and (max-width: 1439px)': {
                    p: '1rem'
                  }
                }}
                p="1.5rem"
                bg="desc.300"
                color="white"
              >
                <IconComp fontSize="3rem" />
              </Circle>
              <Flex
                sx={{
                  '@media screen and (max-width: 1439px)': {
                    fontSize: '1.2rem'
                  }
                }}
                direction="column"
                fontSize="1.4rem"
                color="white"
              >
                <Heading
                  sx={{
                    '@media screen and (max-width: 1439px)': {
                      fontSize: '2rem'
                    }
                  }}
                  textTransform="capitalize"
                  fontSize="2.5rem"
                  lineHeight="1.2"
                >{`${number}k`}</Heading>
                <Text textTransform="capitalize" lineHeight="1.4">
                  {desc}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>

      <Grid
        sx={{
          '@media screen and (max-width: 1439px)': {
            gridTemplateRows: '233px 1fr'
          },
          '@media screen and (max-width: 1279px)': {
            gridTemplateRows: '362px 1fr'
          }
        }}
        flex="1"
        gridTemplateColumns="1fr 0.7fr 1fr"
        gridTemplateRows="290px 1fr"
        mt="3rem"
        gap="1.5rem"
        className={cx('grid-template')}
      >
        <Wrapper label={t('dashboard.dentist.header.subTittle.0')} link={t('dashboard.dentist.header.links.all')}>
          <Flex
            position="absolute"
            inset="0"
            top="3rem"
            width="100%"
            overflow="hidden"
            p="2rem"
            boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            borderRadius="1.2rem"
            direction="column"
            gap="2rem"
          >
            <Flex align="center">
              <ProfileTemplate flex={0.9} />
              <Button flex="0.2" cursor="default" variant="danger" _focus={{ boxShadow: 'none' }}>
                Decline
              </Button>
            </Flex>
            <Flex align="center">
              <ProfileTemplate flex={0.9} />
              <Button flex="0.2" cursor="default" variant="primary" _focus={{ boxShadow: 'none' }}>
                Confirm
              </Button>
            </Flex>
            <Flex align="center">
              <ProfileTemplate flex={0.9} />
              <Button flex="0.2" cursor="default" variant="danger" _focus={{ boxShadow: 'none' }}>
                Decline
              </Button>
            </Flex>
            <Flex align="center">
              <ProfileTemplate flex={0.9} />
              <Button flex="0.2" cursor="default" variant="primary" _focus={{ boxShadow: 'none' }}>
                Confirm
              </Button>
            </Flex>
            <Flex align="center">
              <ProfileTemplate flex={0.9} />
              <Button flex="0.2" cursor="default" variant="danger" _focus={{ boxShadow: 'none' }}>
                Decline
              </Button>
            </Flex>
            <Flex align="center">
              <ProfileTemplate flex={0.9} />
              <Flex flex="0.25" justify="space-between">
                <Square size="3rem" border="1px solid" borderColor="primary.500" color="primary.500" cursor="pointer">
                  <BsCheck fontSize="3rem" />
                </Square>
                <Square size="3rem" border="1px solid" borderColor="red.200" color="red.200" cursor="pointer">
                  <AiOutlineClose fontSize="2rem" />
                </Square>
              </Flex>
            </Flex>
          </Flex>
        </Wrapper>

        <Wrapper
          label={t('dashboard.dentist.header.subTittle.1')}
          dropdown={renderDropdown}
          link={t('dashboard.dentist.header.links.all')}
        >
          <Flex
            sx={{
              '@media screen and (max-width: 1439px)': {
                gap: '1rem'
              }
            }}
            h="100%"
            direction="column"
            borderRadius="1.2rem"
            gap="2rem"
          >
            <Flex
              flex="1"
              borderRadius="inherit"
              direction="column"
              gap="2rem"
              w="100%"
              boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
              p="1.5rem"
            >
              <Flex align="flex-start" justify="space-between">
                <ProfileTemplate title={{ value: '24.4K', fontSize: '2rem' }} />
                <Flex gap="2rem">
                  <Heading color="purple.400" fontSize="1.5rem">
                    15%
                  </Heading>
                </Flex>
              </Flex>
              <Flex align="flex-start" justify="space-between">
                <ProfileTemplate title={{ value: '24.4K', fontSize: '2rem' }} />
                <Flex gap="2rem">
                  <Heading color="purple.400" fontSize="1.5rem">
                    15%
                  </Heading>
                </Flex>
              </Flex>
            </Flex>

            <Flex
              borderRadius="inherit"
              flex="1"
              bg={`url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGJsYWNrfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60') no-repeat center center`}
              justify="space-between"
              align="center"
              p="0 2rem"
            >
              <Flex direction="column" gap="0.5rem" textTransform="capitalize" color="white">
                <Heading
                  sx={{
                    '@media screen and (max-width: 1439px)': {
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  Next Week
                </Heading>
                <Text>upcoming schdules-2</Text>
              </Flex>
              <Button variant="primary" size="lg">
                open
              </Button>
            </Flex>
          </Flex>
        </Wrapper>

        <Wrapper label={t('dashboard.dentist.header.subTittle.2')} dropdown={renderDropdown}>
          <Flex
            direction="column"
            h="100%"
            boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            borderRadius="1.2rem"
            p="1rem 0"
          >
            <Box flex="0.7" position="relative">
              <Flex direction="column" grow="1" position="absolute" inset="0" overflowY="auto">
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: colorMode === 'light' ? 'primary.250' : 'dark.500' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color={colorMode === 'light' ? 'grey.300' : 'purple.400'}>
                    ongoing
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: colorMode === 'light' ? 'primary.250' : 'dark.500' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color={colorMode === 'light' ? 'grey.300' : 'purple.400'}>
                    10:25
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: colorMode === 'light' ? 'primary.250' : 'dark.500' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color={colorMode === 'light' ? 'grey.300' : 'purple.400'}>
                    10:25
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: colorMode === 'light' ? 'primary.250' : 'dark.500' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color={colorMode === 'light' ? 'grey.300' : 'purple.400'}>
                    10:25
                  </Text>
                </Flex>
              </Flex>
            </Box>
            <Flex flex="0.4" direction="column">
              <Box p="0 1rem">
                <Calendar
                  showButtonBar
                  dateFormat={`${minDate.getDate()} - ${maxDate.getDate()} MM, yy`}
                  minDate={minDate}
                  maxDate={maxDate}
                  readOnlyInput
                  value={date}
                  onChange={(e) => setDate(e.value)}
                  panelClassName={colorMode === 'dark' && 'datePicker-panel dark'}
                  todayButtonClassName={colorMode === 'dark' && 'calendar-today-button dark'}
                  clearButtonClassName={colorMode === 'dark' && 'calendar-clear-button dark'}
                />
              </Box>
              <Flex flex="1" justify="flex-start" p="0 1rem" gap="2rem">
                {[...new Array(7)].map((_, index) => {
                  return (
                    <Flex
                      key={`${index}`}
                      flex="1"
                      w="fit-content"
                      direction="column"
                      align="center"
                      justify="center"
                      fontSize="1.5rem"
                      borderRadius="0.6rem"
                      p="0.75rem 0"
                      boxShadow={
                        date.getDate() === minDate.getDate() + index ? 'rgba(100, 100, 111, 0.3) 0px 7px 29px 0px' : ''
                      }
                    >
                      <Text textTransform="uppercase">{week[index]}</Text>
                      <Text>
                        {minDate.getDate() + index === maxDate.getDate()
                          ? maxDate.getDate()
                          : minDate.getDate() + index}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>
          </Flex>
        </Wrapper>

        <Wrapper label={t('dashboard.dentist.header.subTittle.3')} link={t('dashboard.dentist.header.links.all')}>
          <Box position="relative" h="100%">
            <Flex h="100%" position="absolute" inset="0">
              <DataTable
                value={dataTable}
                size="large"
                className={colorMode === 'dark' && 'dark'}
                selectionMode="single"
                selection={selectedPatient}
                onSelectionChange={(e) => setSelectedPatient(e.value)}
                scrollable
                scrollHeight="flex"
                frozen
                rowClassName="dataTable-row"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              >
                <Column
                  field="name"
                  header={t('dashboard.dentist.header.table-header.name')}
                  body={patientNameTemplate}
                  sortable
                ></Column>
                <Column field="id" header="ID" body={(rowData) => bodyDataTableTemplate(rowData.id)} sortable></Column>
                <Column
                  field="date"
                  header={t('dashboard.dentist.header.table-header.date')}
                  body={(rowData) => bodyDataTableTemplate(rowData.date)}
                  sortable
                ></Column>
                <Column
                  field="gender"
                  header={t('dashboard.dentist.header.table-header.gender')}
                  body={(rowData) => bodyDataTableTemplate(rowData.gender)}
                  sortable
                ></Column>
                <Column
                  field="disease"
                  header={t('dashboard.dentist.header.table-header.disease')}
                  body={(rowData) => bodyDataTableTemplate(rowData.disease)}
                  sortable
                ></Column>
                <Column
                  field="status"
                  header={t('dashboard.dentist.header.table-header.status')}
                  body={(rowData) => bodyDataTableTemplate(rowData.status)}
                  sortable
                ></Column>
              </DataTable>
            </Flex>
          </Box>
        </Wrapper>
      </Grid>
    </>
  );
};

export default withTranslation()(OverViewPage);
