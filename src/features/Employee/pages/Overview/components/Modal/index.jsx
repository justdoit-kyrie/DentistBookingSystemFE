/* eslint-disable indent */
import {
  Badge,
  Button,
  Circle,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Square,
  Text,
  useColorMode
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import _ from 'lodash';
import { FilterMatchMode } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { BsCheck } from 'react-icons/bs';
import { USER_SEXUAL } from '~/app/constants';
import { ProfileTemplate } from '~/features/Employee/Templates';
import './Modal.scss';
import { AiFillLock } from 'react-icons/ai';
import { BsFillUnlockFill } from 'react-icons/bs';

const MOCK_DATA = {
  _fieldConstants: {
    request: 'request',
    patient: 'patient'
  },
  statusOpt: ['confirmed', 'success', 'failed'],
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

const CustomModal = ({ t, isOpen, onClose, fieldAll }) => {
  const { _fieldConstants, dataTable, statusOpt } = MOCK_DATA;

  const [searchAppointment, setSearchAppointment] = useState('');
  const [selectedPatient, setSelectedPatient] = useState();
  const [unlockedCustomers, setUnlockedCustomers] = useState(dataTable);
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

  const statusItemTemplate = (option, props) => {
    return option ? <Badge variant={option}>{option}</Badge> : props.placeholder;
  };

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
        panelClassName={colorMode === 'dark' && 'modal-dataTable-dropdown-dark'}
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
        panelClassName={colorMode === 'dark' && 'modal-dataTable-dropdown-dark'}
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

  const renderModalContent = () => {
    switch (fieldAll) {
      case _fieldConstants.request:
        return (
          <Flex direction="column">
            <InputGroup p="1rem" border="1px solid grey" mb="2rem" borderRadius="2rem">
              <InputLeftElement
                pointerEvents="none"
                position="absolute"
                top="50%"
                left="1rem"
                transform="translateY(-50%)"
              >
                <BiSearch color="#5F5D5B" fontSize="2rem" />
              </InputLeftElement>
              <Input
                h="100%"
                placeholder="Enter name"
                fontSize="1.6rem"
                border="none"
                _focus={{ boxShadow: 'none' }}
                value={searchAppointment}
                onChange={(e) => setSearchAppointment(e.target.value)}
              />
            </InputGroup>
            <Flex
              width="100%"
              p="2rem"
              boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
              borderRadius="1.2rem"
              direction="column"
              gap="2rem"
              overflow="auto"
              maxH="60vh"
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
          </Flex>
        );
      case _fieldConstants.patient:
        return (
          <DataTable
            value={unlockedCustomers}
            size="large"
            className={
              colorMode === 'dark' ? 'modal-dataTable modal-dataTable-dark' : 'modal-dataTable overview-dataTable-light'
            }
            selectionMode="single"
            selection={selectedPatient}
            onSelectionChange={(e) => setSelectedPatient(e.value)}
            scrollable
            scrollHeight="60vh"
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
              style={{ minWidth: '20rem' }}
            ></Column>
            <Column
              field="id"
              header="ID"
              body={(rowData) => bodyDataTableTemplate(rowData.id)}
              sortable
              filter
              filterPlaceholder="Search by id"
              style={{ minWidth: '15rem' }}
            ></Column>
            <Column
              field="date"
              header={t('dashboard.dentist.header.table-header.date')}
              body={(rowData) => bodyDataTableTemplate(rowData.date)}
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
              body={(rowData) => bodyDataTableTemplate(rowData.gender)}
              sortable
              filter
              filterElement={genderFilterTemplate}
              showFilterMenu={false}
              style={{ minWidth: '22rem' }}
            ></Column>
            <Column
              field="disease"
              header={t('dashboard.dentist.header.table-header.disease')}
              body={(rowData) => bodyDataTableTemplate(rowData.disease)}
              sortable
              filter
              filterPlaceholder="Search by disease"
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
        );
      default:
        return;
    }
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay zIndex="1" />
      <ModalContent maxW={fieldAll === _fieldConstants.request ? '20vw' : '70vw'}>
        <ModalHeader fontSize="2rem">
          {fieldAll === _fieldConstants.request
            ? t('dashboard.dentist.header.subTittle.0')
            : t('dashboard.dentist.header.subTittle.3')}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderModalContent()}</ModalBody>

        <ModalFooter>
          <Button
            as={motion.button}
            size="lg"
            variant="primary"
            mr={3}
            onClick={onClose}
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 1.1 }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default withTranslation()(CustomModal);
