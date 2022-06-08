/* eslint-disable no-unused-vars */
import { Box, Button, Circle, Flex, Grid, Heading, Image, Square, Text } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { AiOutlineCalendar, AiOutlineClose, AiOutlineVideoCamera } from 'react-icons/ai';
import { BsBuilding, BsCheck } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { ProfileTemplate } from '../../Templates';
import { Wrapper } from './components';
import styles from './OverView.module.scss';
import './Overview.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  statistic: [
    {
      icon: AiOutlineCalendar,
      number: 24.4,
      desc: 'appointments',
      bg: 'purple.500'
    },
    {
      icon: FiUser,
      number: 166.3,
      desc: 'total patient',
      bg: 'red.500'
    },
    {
      icon: BsBuilding,
      number: 53.5,
      desc: 'clinic consulting',
      bg: 'yellow.500'
    },
    {
      icon: AiOutlineVideoCamera,
      number: 28.0,
      desc: 'video consulting',
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
};

const OverViewPage = () => {
  const { statistic, week, dataTable } = MOCK_DATA;

  const [date, setDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [selectedPatient, setSelectedPatient] = useState();
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(1);

  useEffect(() => {
    const day = date.getDate();
    const week = date.getDay();

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
        <Text fontWeight="500" color="grey.300" fontSize="1.4rem">
          {name}
        </Text>
      </Flex>
    );
  };

  const bodyDataTableTemplate = (value) => <Text color="grey.300">{value}</Text>;

  return (
    <>
      <Flex direction="column" gap="1rem" fontSize="1.3rem">
        <Heading textTransform="capitalize">welcome, dr stephen</Heading>
        <Text color="grey.300" fontWeight="500">
          Have a nice dat at great work
        </Text>
      </Flex>

      <Flex gap="2rem" mt="2rem">
        {statistic.map(({ icon, number, desc, bg }, index) => {
          const IconComp = icon;
          return (
            <Flex flex="1" key={`${index}`} gap="2rem" bg={bg} p="1.5rem 2rem" align="center" borderRadius="1.2rem">
              <Circle p="1.5rem" bg="desc.300" color="white">
                <IconComp fontSize="3rem" />
              </Circle>
              <Flex direction="column" fontSize="1.4rem" color="white">
                <Heading textTransform="capitalize" fontSize="2.5rem">{`${number}k`}</Heading>
                <Text textTransform="capitalize">{desc}</Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>

      <Grid
        gridTemplateColumns="1fr 0.7fr 1fr"
        gridTemplateRows="repeat(2, 1fr)"
        gap="1.5rem"
        flex="1"
        mt="3rem"
        className={cx('grid-template')}
      >
        <Wrapper label="appointment request" link="view all">
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

        <Wrapper label="patients" dropdown={renderDropdown} link="view all">
          <Flex h="100%" direction="column" borderRadius="1.2rem" gap="2rem">
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
                <Heading>Next Week</Heading>
                <Text>upcoming schdules-2</Text>
              </Flex>
              <Button variant="primary" size="lg">
                open
              </Button>
            </Flex>
          </Flex>
        </Wrapper>

        <Wrapper label="today appointment" dropdown={renderDropdown}>
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
                  _hover={{ bg: 'primary.250' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color="grey.300">
                    ongoing
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: 'primary.250' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color="grey.300">
                    10:25
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: 'primary.250' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color="grey.300">
                    10:25
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  justify="space-between"
                  p="1.5rem 2rem"
                  borderRadius="1.2rem"
                  fontSize="1.2rem"
                  _hover={{ bg: 'primary.250' }}
                >
                  <ProfileTemplate />
                  <Text textTransform="capitalize" color="grey.300">
                    10:25
                  </Text>
                </Flex>
              </Flex>
            </Box>
            <Flex flex="0.4" direction="column">
              <Box p="0 1rem">
                <Calendar
                  showButtonBar
                  todayButtonClassName={cx('calendar-today-button')}
                  clearButtonClassName={cx('calendar-clear-button')}
                  dateFormat={`${minDate.getDate()} - ${maxDate.getDate()} MM, yy`}
                  minDate={minDate}
                  maxDate={maxDate}
                  readOnlyInput
                  value={date}
                  onChange={(e) => setDate(e.value)}
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

        <Wrapper label="recent patients" link="view all">
          <Box position="relative" bg="red" h="100%">
            <Flex bg="aqua" h="100%" position="absolute" inset="0">
              <DataTable
                value={dataTable}
                size="large"
                style={{ width: '100%', overflow: 'hidden' }}
                selectionMode="single"
                selection={selectedPatient}
                onSelectionChange={(e) => setSelectedPatient(e.value)}
                scrollable
                scrollHeight="flex"
                responsiveLayout="scroll"
                rowClassName="dataTable-row"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
              >
                <Column field="name" header="Name" body={patientNameTemplate} sortable></Column>
                <Column field="id" header="ID" body={(rowData) => bodyDataTableTemplate(rowData.id)} sortable></Column>
                <Column
                  field="date"
                  header="Date"
                  body={(rowData) => bodyDataTableTemplate(rowData.date)}
                  sortable
                ></Column>
                <Column
                  field="gender"
                  header="Gender"
                  body={(rowData) => bodyDataTableTemplate(rowData.gender)}
                  sortable
                ></Column>
                <Column
                  field="disease"
                  header="Diseases"
                  body={(rowData) => bodyDataTableTemplate(rowData.disease)}
                  sortable
                ></Column>
                <Column
                  field="status"
                  header="Status"
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

export default OverViewPage;
