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
import { API_CODE, API_ROUTES, DATE_FORMAT, STATUS_CODE, USER_POSITION, USER_SEXUAL } from '~/app/constants';
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

const Dentists = ({ t }) => {
  const { statusOpt } = MOCK_DATA;

  const [paginationInfo, setPaginationInfo] = useState();
  const [editDentist, setEditDentist] = useState();
  const [dataTableFirst, setDataTableFirst] = useState(0);
  const [dataTablePage, setDataTablePage] = useState(0);
  const [selectedDentist, setSelectedDentist] = useState();
  const [unlockedDentists, setUnlockedDentists] = useState([]);
  const [lockedDentists, setLockedDentists] = useState([]);
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
    position: { value: null, matchMode: FilterMatchMode.EQUALS },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const DataTableComp = colorMode === 'dark' ? DataTableWrapper : Fragment;

  const fetchData = async () => {
    try {
      const { code, content, pagination } = await axios.get(API_ROUTES.dentists, {
        params: { pageNumber: dataTablePage + 1 }
      });
      if (+code === API_CODE.OK) {
        setUnlockedDentists(handleMapDate(content));
        setLockedDentists([]);
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
      const { code, message } = await axios.delete(API_ROUTES.dentists + `/${id}`);
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

  const patientNameTemplate = ({ firstName, lastName, imageUrl }) => {
    return (
      <Flex gap="1rem" align="center">
        <Avatar size="lg" name={`${lastName} ${firstName}`} src={imageUrl} />
        <Text fontWeight="500" color={colorMode === 'light' ? 'grey.300' : 'white'} fontSize="1.4rem">
          {`${lastName} ${firstName}`}
        </Text>
      </Flex>
    );
  };

  const toggleLock = (data, frozen, index) => {
    let _lockedDentists, _unlockedDentists;

    if (frozen) {
      _lockedDentists = lockedDentists.filter((c, i) => i !== index);
      _unlockedDentists = [...unlockedDentists, data];
    } else {
      _unlockedDentists = unlockedDentists.filter((c, i) => i !== index);
      _lockedDentists = [...lockedDentists, data];
    }

    _unlockedDentists.sort((val1, val2) => {
      return val1.id < val2.id ? -1 : 1;
    });

    setLockedDentists(_lockedDentists);
    setUnlockedDentists(_unlockedDentists);
  };

  const lockTemplate = (rowData, options) => {
    const IconComp = options.frozenRow ? AiFillLock : BsFillUnlockFill;
    const disabled = options.frozenRow ? false : lockedDentists.length >= 3;

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
            setEditDentist({
              ...rowData,
              serviceId: rowData.services.map((item) => item.id)
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
            handleDeleteRow(rowData.dentistID);
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
    let root;
    switch (options.field) {
      case 'gender':
        root = USER_SEXUAL;
        break;
      default:
        root = USER_POSITION;
    }

    return (
      <Dropdown
        value={options.value}
        options={_.keys(root)}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={(option, props) => (option ? <Text as="span">{root[option]}</Text> : props?.placeholder)}
        valueTemplate={(option, props) => (option ? <Text as="span">{root[option]}</Text> : props?.placeholder)}
        placeholder={options.field === 'gender' ? 'Select a Gender' : 'Select a position'}
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
        <CustomModal label="dentists" isOpen={isOpen} onClose={onClose} data={editDentist} callback={fetchData} />
      )}

      <Heading mb="2rem" color="primary.500" textTransform="uppercase" letterSpacing="0.25rem">
        Dentists management
      </Heading>

      <Box mb="2rem">
        <Button
          variant="outline"
          textTransform="capitalize"
          w="10rem"
          py="2rem"
          borderColor="primary.300"
          color="primary.300"
          _hover={{ bg: 'primary.300', color: 'white' }}
          onClick={() => {
            onOpen();
            setEditDentist(null);
          }}
        >
          Add
        </Button>
      </Box>

      <Box position="relative" flex="1">
        <DataTableComp>
          <DataTable
            value={unlockedDentists}
            size="large"
            className={cx('common-dataTable', 'users-dataTable')}
            selectionMode="single"
            selection={selectedDentist}
            onSelectionChange={(e) => setSelectedDentist(e.value)}
            scrollable
            scrollDirection="both"
            scrollHeight="flex"
            rowClassName={cx('dataTable-row')}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            frozenValue={lockedDentists}
            filters={filters}
            filterDisplay="row"
            globalFilterFields={['firstName', 'lastName', 'phone', 'email']}
            emptyMessage="No customers found."
            header={renderDataTableHeader}
            footer={renderDataTableFooter}
          >
            <Column
              header={t('dashboard.dentist.header.table-header.name')}
              body={patientNameTemplate}
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
              field="position"
              header="Position"
              body={(rowData) => bodyDataTableTemplate(USER_POSITION[rowData.position])}
              sortable
              filter
              filterElement={genderFilterTemplate}
              showFilterMenu={false}
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
              field="description"
              header="Description"
              body={(rowData) => bodyDataTableTemplate(rowData.description)}
              sortable
              style={{
                minWidth: '30rem',
                maxWidth: '29rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
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

export default withTranslation()(Dentists);
