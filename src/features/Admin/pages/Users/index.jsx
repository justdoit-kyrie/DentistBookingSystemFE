import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import _ from 'lodash';
import moment from 'moment';
import { FilterMatchMode } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import React, { Fragment, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiFillLock } from 'react-icons/ai';
import { BiSearch, BiTrash } from 'react-icons/bi';
import { BsFillUnlockFill } from 'react-icons/bs';
import { MdModeEditOutline } from 'react-icons/md';
import { RiFilterOffLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, DATE_FORMAT, STATUS_CODE, USER_SEXUAL } from '~/app/constants';
import styles from '~/features/Admin/styles/common.module.scss';
import { DataTableWrapper } from '../../styles';
import { CustomModal } from '../components';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  _fieldConstants: {
    request: 'request',
    patient: 'patient'
  },
  statusOpt: [0, 1]
};

const Users = ({ t }) => {
  const { statusOpt } = MOCK_DATA;

  const [paginationInfo, setPaginationInfo] = useState();
  const [dataTableFirst, setDataTableFirst] = useState(0);
  const [dataTablePage, setDataTablePage] = useState(0);
  const [editCustomer, setEditCustomer] = useState();
  const [selectedPatient, setSelectedPatient] = useState();
  const [unlockedCustomers, setUnlockedCustomers] = useState([]);
  const [lockedCustomers, setLockedCustomers] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    dob: {
      value: null,
      matchMode: FilterMatchMode.DATE_IS
    },
    phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
    gender: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const DataTableComp = colorMode === 'dark' ? DataTableWrapper : Fragment;

  const fetchData = async () => {
    try {
      const { code, content, pagination } = await axios.get(API_ROUTES.users, {
        params: { pageNumber: dataTablePage + 1 }
      });
      if (+code === API_CODE.OK) {
        setUnlockedCustomers(handleMapDate(content));
        setLockedCustomers([]);
        setPaginationInfo(pagination);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataTablePage]);

  const initFilter = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: { value: null, matchMode: FilterMatchMode.CONTAINS },
      dob: {
        value: null,
        matchMode: FilterMatchMode.DATE_IS
      },
      phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
      gender: { value: null, matchMode: FilterMatchMode.EQUALS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      email: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    setGlobalFilterValue('');
  };

  const handleMapDate = (list) => list.map((item) => ({ ...item, dob: moment(item.dob).toDate() }));

  const handleDeleteRow = async (id) => {
    try {
      const { code, message } = await axios.delete(API_ROUTES.users + `/${id}`);
      if (+code === API_CODE.OK) {
        toast.success(message);
        fetchData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusItemTemplate = (option, props) =>
    option || option === 0 ? <Badge variant={STATUS_CODE[option]}>{STATUS_CODE[option]}</Badge> : props?.placeholder;

  const bodyDataTableTemplate = (value) => <Text color={colorMode === 'light' ? 'grey.300' : 'white'}>{value}</Text>;

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        dateFormat="dd/mm/yy"
        placeholder="dd/mm/yy"
        className={cx('users-calendar')}
        panelClassName={colorMode === 'dark' && cx('calendar-dark')}
      />
    );
  };

  const userNameTemplate = ({ firstName, lastName, imageUrl }) => {
    return (
      <Flex gap="1rem" align="center">
        <Circle size="3rem" overflow="hidden">
          <Avatar src={imageUrl} name={`${firstName} ${lastName}`} alt="avatar" />
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
      <Flex gap="1rem" align="center">
        <Circle
          as={motion.div}
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 1.1 }}
          size="4rem"
          bg="white.200"
          _hover={{ bg: 'yellow.500', color: 'white' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
            const { id: userId, email, firstName, lastName, phone, dob, gender, imageUrl } = rowData;
            setEditCustomer({
              userId,
              email,
              firstName,
              lastName,
              phone,
              dob,
              gender,
              imageUrl
            });
          }}
        >
          <MdModeEditOutline fontSize="2rem" />
        </Circle>

        <Circle
          as={motion.div}
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 1.1 }}
          size="4rem"
          bg="white.200"
          _hover={{ bg: 'red.200', color: 'white' }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteRow(rowData.id);
          }}
        >
          <BiTrash fontSize="2rem" />
        </Circle>

        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => toggleLock(rowData, options.frozenRow, options.rowIndex)}
        >
          <IconComp fontSize="1.6rem" />
        </Button>
      </Flex>
    );
  };

  const genderFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={_.keys(USER_SEXUAL)}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={(option, props) => (option ? <span>{USER_SEXUAL[option]}</span> : props?.placeholder)}
        valueTemplate={(option, props) => (option ? <span>{USER_SEXUAL[option]}</span> : props?.placeholder)}
        placeholder="Select a Gender"
        panelClassName={colorMode === 'dark' && cx('dataTable-dark', 'modal-dataTable-dark')}
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
        panelClassName={colorMode === 'dark' && cx('modal-dataTable-dark')}
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
    let passProps = {};
    if (colorMode === 'light')
      passProps = { borderColor: 'primary.500', color: 'primary.500', _hover: { color: 'white', bg: 'primary.500' } };

    return (
      <Flex justify="space-between" align="center">
        <Button
          size="lg"
          variant="outline"
          fontSize="1.5rem"
          h="auto"
          leftIcon={<RiFilterOffLine />}
          onClick={initFilter}
          {...passProps}
        >
          Clear
        </Button>

        <InputGroup
          p="1rem"
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
            placeholder="Enter keyword"
            fontSize="1.6rem"
            border="none"
            color={colorMode === 'light' ? 'black' : 'white'}
            _focus={{ boxShadow: 'none' }}
            value={globalFilterValue}
            onChange={handleGlobalFilterChange}
          />
        </InputGroup>
      </Flex>
    );
  };

  const renderDataTableFooter = () => {
    return (
      paginationInfo && (
        <Paginator
          className={cx('users-footer')}
          first={dataTableFirst}
          rows={paginationInfo.pageSize}
          totalRecords={paginationInfo.totalRecords}
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          onPageChange={(e) => {
            setDataTablePage(e.page);
            setDataTableFirst(e.first);
          }}
        ></Paginator>
      )
    );
  };

  return (
    <>
      {isOpen && (
        <CustomModal label="users" isOpen={isOpen} onClose={onClose} data={editCustomer} callback={fetchData} />
      )}

      <Heading mb="2rem" color="primary.500" textTransform="uppercase" letterSpacing="0.25rem">
        Users management
      </Heading>

      <Box position="relative" flex="1">
        <DataTableComp>
          <DataTable
            value={unlockedCustomers}
            size="large"
            className={cx('common-dataTable', 'users-dataTable')}
            selectionMode="single"
            selection={selectedPatient}
            onSelectionChange={(e) => setSelectedPatient(e.value)}
            scrollable
            scrollDirection="both"
            scrollHeight="flex"
            rowClassName={cx('dataTable-row')}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            frozenValue={lockedCustomers}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={['firstName', 'lastName', 'phone', 'email']}
            emptyMessage="No customers found."
            header={renderDataTableHeader}
            footer={renderDataTableFooter}
          >
            <Column
              header={t('dashboard.dentist.header.table-header.name')}
              body={userNameTemplate}
              sortField="firstName"
              filterField="lastName"
              sortable
              filter
              filterPlaceholder="Search by name"
              style={{ minWidth: '30rem' }}
            ></Column>
            <Column
              field="email"
              header="Email"
              body={(rowData) => bodyDataTableTemplate(rowData.email)}
              sortable
              filter
              filterPlaceholder="Search by email"
              style={{ minWidth: '30rem' }}
            ></Column>
            <Column
              field="dob"
              header="date of birth"
              body={(rowData) => bodyDataTableTemplate(moment(rowData.dob).format(DATE_FORMAT['DD/MM/YYYY']))}
              sortable
              filter
              filterField="dob"
              dataType="date"
              filterElement={dateFilterTemplate}
              style={{ minWidth: '25rem' }}
            ></Column>
            <Column
              field="gender"
              header={t('dashboard.dentist.header.table-header.gender')}
              body={(rowData) => bodyDataTableTemplate(USER_SEXUAL[rowData.gender])}
              sortable
              filter
              filterElement={genderFilterTemplate}
              showFilterMenu={false}
              style={{ minWidth: '25rem' }}
            ></Column>
            <Column
              field="phone"
              header="phone"
              body={(rowData) => bodyDataTableTemplate(rowData.phone)}
              sortable
              filter
              filterPlaceholder="Search by phone"
              style={{ minWidth: '25rem' }}
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
                flex: '1'
              }}
            />
          </DataTable>
        </DataTableComp>
      </Box>
    </>
  );
};

export default withTranslation()(Users);
