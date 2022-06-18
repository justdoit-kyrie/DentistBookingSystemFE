/* eslint-disable no-unused-vars */
import {
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorMode
} from '@chakra-ui/react';
import _ from 'lodash';
import moment from 'moment';
import { FilterMatchMode } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiFillLock } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { BsFillUnlockFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, DATE_FORMAT, STATUS_CODE, USER_SEXUAL } from '~/app/constants';
import './Users.scss';

const MOCK_DATA = {
  _fieldConstants: {
    request: 'request',
    patient: 'patient'
  },
  statusOpt: [0, 1],
  dataTable: [
    {
      id: 0,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'success'
    },
    {
      id: 1,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'success'
    },
    {
      id: 2,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'success'
    },
    {
      id: 3,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'confirmed'
    },
    {
      id: 4,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'confirmed'
    },
    {
      id: 5,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'confirmed'
    },
    {
      id: 6,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'failed'
    },
    {
      id: 7,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'failed'
    },
    {
      id: 8,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'failed'
    },
    {
      id: 9,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'success'
    },
    {
      id: 10,
      name: 'John Doe',
      date: '5/7/21',
      gender: 'male',
      disease: 'teeth',
      status: 'success'
    }
  ]
};

const Users = ({ t }) => {
  const { dataTable, statusOpt } = MOCK_DATA;

  const [selectedPatient, setSelectedPatient] = useState();
  const [unlockedCustomers, setUnlockedCustomers] = useState([]);
  const [lockedCustomers, setLockedCustomers] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date: { value: null, matchMode: FilterMatchMode.DATE_IS },
    disease: { value: null, matchMode: FilterMatchMode.CONTAINS },
    gender: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const { colorMode } = useColorMode();

  const fetchData = async () => {
    try {
      const { code, content } = await axios.get(API_ROUTES.users);
      if (+code === API_CODE.OK) {
        console.log({ content });
        setUnlockedCustomers(content);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusItemTemplate = (option, props) =>
    option || option === 0 ? <Badge variant={STATUS_CODE[option]}>{STATUS_CODE[option]}</Badge> : props?.placeholder;

  const bodyDataTableTemplate = (value) => <Text color={colorMode === 'light' ? 'grey.300' : 'white'}>{value}</Text>;

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value)}
        dateFormat="d/m/y"
        placeholder="dd/mm/yy"
        className="modal-calendar"
        panelClassName={colorMode === 'dark' && 'calendar-dark'}
      />
    );
  };

  const patientNameTemplate = ({ firstName, lastName, imageUrl }) => {
    console.log({ firstName, lastName, imageUrl });
    return (
      <Flex gap="1rem" align="center">
        <Circle size="3rem" overflow="hidden">
          <Image
            src={
              imageUrl
                ? imageUrl
                : 'https://images.unsplash.com/photo-1654552643262-192b454c5c62?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
            }
            alt="avatar"
          />
        </Circle>
        <Text fontWeight="500" color={colorMode === 'light' ? 'grey.300' : 'white'} fontSize="1.4rem">
          {`${lastName} ${firstName}`}
        </Text>
      </Flex>
    );
  };

  const toggleLock = (data, frozen, index) => {
    let _lockedCustomers, _unlockedCustomers;

    if (frozen) {
      _lockedCustomers = lockedCustomers.filter((c, i) => i !== index);
      _unlockedCustomers = [...unlockedCustomers, data];
    } else {
      _unlockedCustomers = unlockedCustomers.filter((c, i) => i !== index);
      _lockedCustomers = [...lockedCustomers, data];
    }

    _unlockedCustomers.sort((val1, val2) => {
      return val1.id < val2.id ? -1 : 1;
    });

    setLockedCustomers(_lockedCustomers);
    setUnlockedCustomers(_unlockedCustomers);
  };

  const lockTemplate = (rowData, options) => {
    const IconComp = options.frozenRow ? AiFillLock : BsFillUnlockFill;
    const disabled = options.frozenRow ? false : lockedCustomers.length >= 3;

    return (
      <Button
        variant="outline"
        disabled={disabled}
        className="p-button-sm p-button-text"
        onClick={() => toggleLock(rowData, options.frozenRow, options.rowIndex)}
      >
        <IconComp fontSize="1.6rem" />
      </Button>
    );
  };

  const genderFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={_.values(USER_SEXUAL)}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select a Gender"
        panelClassName={colorMode === 'dark' && 'dataTable-dark modal-dataTable-dark'}
        showClear
      />
    );
  };

  const statusFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statusOpt}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        valueTemplate={statusItemTemplate}
        placeholder="Select a Status"
        panelClassName={colorMode === 'dark' && 'modal-dataTable-dark'}
        showClear
      />
    );
  };

  const handleSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
  };

  const handleGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderDataTableHeader = () => {
    return (
      <InputGroup
        p="1rem"
        ml="auto"
        border="1px solid"
        borderColor={colorMode === 'light' ? 'grey' : 'white'}
        borderRadius="0.6rem"
        width="fit-content"
      >
        <InputLeftElement pointerEvents="none" position="absolute" top="50%" left="1rem" transform="translateY(-50%)">
          <BiSearch color="#5F5D5B" fontSize="2rem" />
        </InputLeftElement>
        <Input
          h="100%"
          placeholder="Enter name"
          fontSize="1.6rem"
          border="none"
          color={colorMode === 'light' ? 'black' : 'white'}
          _focus={{ boxShadow: 'none' }}
          value={globalFilterValue}
          onChange={handleGlobalFilterChange}
        />
      </InputGroup>
    );
  };

  return (
    <>
      <Heading mb="2rem" color="primary.500" textTransform="uppercase" letterSpacing="0.25rem">
        Users management
      </Heading>

      <Box position="relative" flex="1">
        <DataTable
          value={unlockedCustomers}
          size="large"
          className={colorMode === 'dark' ? 'modal-dataTable-dark' : 'overview-dataTable-light'}
          selectionMode="single"
          selection={selectedPatient}
          onSelectionChange={(e) => setSelectedPatient(e.value)}
          scrollable
          scrollDirection="both"
          scrollHeight="flex"
          rowClassName="dataTable-row"
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          paginator
          frozenValue={lockedCustomers}
          rows={10}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={['name', 'gender', 'disease', 'status']}
          emptyMessage="No customers found."
          header={renderDataTableHeader}
        >
          <Column
            field="name"
            header={t('dashboard.dentist.header.table-header.name')}
            body={patientNameTemplate}
            sortable
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: '25rem' }}
          ></Column>
          <Column
            field="email"
            header="Email"
            body={(rowData) => bodyDataTableTemplate(rowData.email)}
            sortable
            filter
            filterPlaceholder="Search by email"
            style={{ minWidth: '22rem' }}
          ></Column>
          <Column
            field="dob"
            header="date of birth"
            body={(rowData) => bodyDataTableTemplate(moment(rowData.dob).format(DATE_FORMAT['DD/MM/YYYY']))}
            sortable
            filterField="date"
            dataType="date"
            filter
            filterElement={dateFilterTemplate}
            style={{ minWidth: '15rem' }}
          ></Column>
          <Column
            field="gender"
            header={t('dashboard.dentist.header.table-header.gender')}
            body={(rowData) => bodyDataTableTemplate(USER_SEXUAL[rowData.gender])}
            sortable
            filter
            filterElement={genderFilterTemplate}
            showFilterMenu={false}
            style={{ minWidth: '22rem' }}
          ></Column>
          <Column
            field="phone"
            header="phone"
            body={(rowData) => bodyDataTableTemplate(rowData.phone)}
            sortable
            filter
            filterPlaceholder="Search by phone"
            style={{ minWidth: '20rem' }}
          ></Column>
          <Column
            field="status"
            header={t('dashboard.dentist.header.table-header.status')}
            body={(rowData) => statusItemTemplate(rowData.status)}
            sortable
            filter
            filterElement={statusFilterTemplate}
            showFilterMenu={false}
            style={{ minWidth: '22rem' }}
          ></Column>
          <Column
            header="action"
            body={lockTemplate}
            style={{
              maxWidth: '7rem'
            }}
          />
        </DataTable>
      </Box>
    </>
  );
};

export default withTranslation()(Users);
