import {
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
import moment from 'moment';
import { FilterMatchMode } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { Fragment, useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiFillLock } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { BsFillUnlockFill } from 'react-icons/bs';
import { FaBan } from 'react-icons/fa';
import { MdModeEditOutline } from 'react-icons/md';
import { RiFilterOffLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, DATE_FORMAT, STATUS_CODE } from '~/app/constants';
import common_styles from '~/features/Admin/styles/common.module.scss';
import { DataTableWrapper } from '../../styles';
import { CustomModal } from '../components';
import specific_styles from './Services.module.scss';
import { TabViewWrapper } from './style';

const cx = classNames.bind(common_styles);
const specific_cx = classNames.bind(specific_styles);

const MOCK_DATA = {
  statusOpt: [0, 1],
  contentOpt: ['services', 'discounts'],
  initialFilter: {
    common: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      id: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS }
    },
    services: {
      serviceName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      price: { value: null, matchMode: FilterMatchMode.CONTAINS }
    },
    discounts: {
      percent: { value: null, matchMode: FilterMatchMode.CONTAINS },
      amount: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: { value: null, matchMode: FilterMatchMode.CONTAINS },
      startDate: {
        value: null,
        matchMode: FilterMatchMode.DATE_IS
      },
      endDate: {
        value: null,
        matchMode: FilterMatchMode.DATE_IS
      }
    }
  }
};

const Services = ({ t }) => {
  const { statusOpt, contentOpt, initialFilter } = MOCK_DATA;

  const [activeIndex, setActiveIndex] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState();
  const [editData, setEditData] = useState();
  const [dataTableFirst, setDataTableFirst] = useState(0);
  const [dataTablePage, setDataTablePage] = useState(0);
  const [selectedData, setSelectedData] = useState();
  const [unlockedData, setUnlockedData] = useState([]);
  const [lockedData, setLockedData] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({ ...initialFilter.common, ...initialFilter[contentOpt[activeIndex]] });

  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const DataTableComp = colorMode === 'dark' ? DataTableWrapper : Fragment;

  const handleMapDate = (list) =>
    list.map((item) => ({
      ...item,
      startDate: moment(item.startDate).toDate(),
      endDate: moment(item.endDate).toDate()
    }));

  const fetchData = async () => {
    try {
      const { code, content, pagination } = await axios.get(API_ROUTES[contentOpt[activeIndex]], {
        params: { pageNumber: dataTablePage + 1 }
      });
      if (+code === API_CODE.OK) {
        setUnlockedData(handleMapDate(content));
        setLockedData([]);
        setPaginationInfo(pagination);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataTablePage, activeIndex]);

  const initFilter = () => {
    setFilters({ ...initialFilter.common, ...initialFilter[contentOpt[activeIndex]] });
    setGlobalFilterValue('');
  };

  const handleDeleteRow = async (id) => {
    try {
      const { code, message } = await axios.delete(API_ROUTES.services, {
        params: { serviceId: id }
      });
      if (+code === API_CODE.OK) {
        toast.success(message);
        fetchData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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

  const statusItemTemplate = (option, props) =>
    option || option === 0 ? <Badge variant={STATUS_CODE[option]}>{STATUS_CODE[option]}</Badge> : props?.placeholder;

  const bodyDataTableTemplate = (value) => <Text color={colorMode === 'light' ? 'grey.300' : 'white'}>{value}</Text>;

  const toggleLock = (data, frozen, index) => {
    let _lockedData, _unlockedData;

    if (frozen) {
      _lockedData = lockedData.filter((c, i) => i !== index);
      _unlockedData = [...unlockedData, data];
    } else {
      _unlockedData = unlockedData.filter((c, i) => i !== index);
      _lockedData = [...lockedData, data];
    }

    _unlockedData.sort((val1, val2) => {
      return val1.id < val2.id ? -1 : 1;
    });

    setLockedData(_lockedData);
    setUnlockedData(_unlockedData);
  };

  const lockTemplate = (rowData, options) => {
    const IconComp = options.frozenRow ? AiFillLock : BsFillUnlockFill;
    const disabled = options.frozenRow ? false : lockedData.length >= 3;

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
            setEditData(rowData);
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
          <FaBan fontSize="2rem" />
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
        <Flex gap="2rem">
          <Button
            w="8rem"
            size="lg"
            variant="outline"
            fontSize="1.5rem"
            h="auto"
            {...passProps}
            onClick={() => {
              onOpen();
              setEditData(null);
            }}
          >
            Add
          </Button>
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
        </Flex>

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
        <CustomModal
          label={contentOpt[activeIndex]}
          isOpen={isOpen}
          onClose={onClose}
          data={editData}
          callback={fetchData}
        />
      )}

      <Heading mb="2rem" color="primary.500" textTransform="uppercase" letterSpacing="0.25rem">
        {activeIndex === 0 ? 'services' : 'discounts'} management
      </Heading>

      <TabViewWrapper>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => {
            setActiveIndex(e.index);
            setFilters({ ...initialFilter.common, ...initialFilter[contentOpt[e.index]] });
          }}
        >
          <TabPanel header="services" className={specific_cx('services-tab-panel')}>
            <Box position="relative" h="100%">
              <DataTableComp>
                <DataTable
                  value={unlockedData}
                  size="large"
                  className={cx('common-dataTable', 'users-dataTable')}
                  selectionMode="single"
                  selection={selectedData}
                  onSelectionChange={(e) => setSelectedData(e.value)}
                  scrollable
                  scrollDirection="both"
                  scrollHeight="flex"
                  rowClassName={cx('dataTable-row')}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  frozenValue={lockedData}
                  filters={filters}
                  filterDisplay="row"
                  globalFilterFields={['id', 'serviceName', 'price']}
                  emptyMessage="No clinics found."
                  header={renderDataTableHeader}
                  footer={renderDataTableFooter}
                >
                  <Column
                    header="ID"
                    body={(rowData) => bodyDataTableTemplate(rowData.id)}
                    field="id"
                    sortable
                    filter
                    filterPlaceholder="Search by id"
                    style={{ minWidth: '30rem' }}
                  ></Column>
                  <Column
                    field="serviceName"
                    header={t('dashboard.dentist.header.table-header.name')}
                    body={(rowData) => bodyDataTableTemplate(rowData.serviceName)}
                    sortable
                    filter
                    filterPlaceholder="Search by name"
                    style={{ minWidth: '30rem' }}
                  ></Column>
                  <Column
                    field="procedure"
                    header="Procedure"
                    body={(rowData) => bodyDataTableTemplate(rowData.procedure)}
                    sortable
                    style={{ minWidth: '30rem' }}
                  ></Column>
                  <Column
                    field="price"
                    header="Price"
                    body={(rowData) => bodyDataTableTemplate(rowData.price)}
                    sortable
                    filter
                    filterPlaceholder="Search by price"
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
          </TabPanel>

          <TabPanel header="discounts" className={specific_cx('services-tab-panel')}>
            <Box position="relative" h="100%">
              <DataTableComp>
                <DataTable
                  value={unlockedData}
                  size="large"
                  className={cx('common-dataTable', 'users-dataTable')}
                  selectionMode="single"
                  selection={selectedData}
                  onSelectionChange={(e) => setSelectedData(e.value)}
                  scrollable
                  scrollDirection="both"
                  scrollHeight="flex"
                  rowClassName={cx('dataTable-row')}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  frozenValue={lockedData}
                  filters={filters}
                  filterDisplay="row"
                  globalFilterFields={['title', 'amount', 'percent', 'id']}
                  emptyMessage="No clinics found."
                  header={renderDataTableHeader}
                  footer={renderDataTableFooter}
                >
                  <Column
                    header="ID"
                    body={(rowData) => bodyDataTableTemplate(rowData.id)}
                    field="id"
                    sortable
                    filter
                    filterPlaceholder="Search by id"
                    style={{ minWidth: '30rem' }}
                  ></Column>
                  <Column
                    header={t('dashboard.dentist.header.table-header.name')}
                    body={(rowData) => bodyDataTableTemplate(rowData.title)}
                    field="title"
                    sortable
                    filter
                    filterPlaceholder="Search by name"
                    style={{ minWidth: '30rem' }}
                  ></Column>
                  <Column
                    field="amount"
                    header="Amount"
                    body={(rowData) => bodyDataTableTemplate(rowData.amount)}
                    sortable
                    filter
                    filterPlaceholder="Search by amount"
                    style={{ minWidth: '30rem' }}
                  ></Column>
                  <Column
                    field="percent"
                    header="Percent"
                    body={(rowData) => bodyDataTableTemplate(rowData.percent)}
                    sortable
                    filter
                    filterPlaceholder="Search by percent"
                    style={{ minWidth: '25rem' }}
                  ></Column>
                  <Column
                    field="startDate"
                    header="Start Date"
                    body={(rowData) =>
                      bodyDataTableTemplate(moment(rowData.startDate).format(DATE_FORMAT['DD/MM/YYYY']))
                    }
                    sortable
                    filter
                    filterField="startDate"
                    dataType="date"
                    filterElement={dateFilterTemplate}
                    style={{ minWidth: '25rem' }}
                  ></Column>
                  <Column
                    field="endDate"
                    header="End Date"
                    body={(rowData) => bodyDataTableTemplate(moment(rowData.endDate).format(DATE_FORMAT['DD/MM/YYYY']))}
                    sortable
                    filter
                    filterField="endDate"
                    dataType="date"
                    filterElement={dateFilterTemplate}
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
          </TabPanel>
        </TabView>
      </TabViewWrapper>
    </>
  );
};

export default withTranslation()(Services);
