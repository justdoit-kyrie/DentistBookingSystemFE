import {
  Avatar,
  Badge,
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import _ from 'lodash';
import moment from 'moment';
import { Carousel } from 'primereact/carousel';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FaBan } from 'react-icons/fa';
import { MdModeEditOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import {
  API_CODE,
  API_ROUTES,
  DATE_FORMAT,
  SCHEDULE_TIMER,
  STATUS_CODE,
  USER_POSITION,
  USER_SEXUAL
} from '~/app/constants';
import { Dropdown as Propper, Loading } from '~/components';
import { compareDate } from '~/utils';
import styles from './Modal.module.scss';
const MOCK_DATA = {
  // đơn vị rem
  step_size: 4,
  step_default_gap: 3,
  statusColor: {
    [STATUS_CODE[0]]: 'green.400',
    [STATUS_CODE[1]]: 'red.200',
    [STATUS_CODE[2]]: 'yellow.500',
    [STATUS_CODE[3]]: 'purple.300',
    [STATUS_CODE[4]]: 'green.400',
    [STATUS_CODE[5]]: 'red.200'
  }
};

const cx = classNames.bind(styles);

const NOW = moment();

const DetailModal = ({ isOpen, onClose, data }) => {
  const { step_size, step_default_gap, statusColor } = MOCK_DATA;

  const servicesRef = useRef();
  const patientsRef = useRef();

  const [loading, setLoading] = useState(false);
  const [statusEditing, setStatusEditing] = useState();
  const [distanceTop, setDistanceTop] = useState(0);
  const [distanceBottom, setDistanceBottom] = useState(0);
  const [page, setPage] = useState(0);
  const [dentist, setDentist] = useState([]);
  const [patient, setPatient] = useState();
  const [bookingDetailAll, setBookingDetailAll] = useState([]);
  const [bookingDetail, setBookingDetail] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [content, { code: bookingCode, details }] = await Promise.all([
        axios.get(`${API_ROUTES.users}/${data.userId}`),
        axios.get(`${API_ROUTES.bookings}/getbookingdetail`, { params: { bookingId: data.id } })
      ]);

      if (content && +bookingCode === API_CODE.OK) {
        const groupByDentist = _.groupBy(details, (o) => o.dentist.id);
        const keys = _.keys(groupByDentist);
        const values = _.values(groupByDentist);
        const dentists = keys.map((item) => details.find((o) => o.dentist.id === item).dentist);

        setDentist(dentists);
        setPatient(content);
        setBookingDetailAll(values);
        setBookingDetail(values[page] || []);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let serviceHeight = 0;
    let patientHeight = 0;
    if (servicesRef.current) {
      serviceHeight = servicesRef.current.offsetHeight;
    }

    if (patientsRef.current) {
      patientHeight = patientsRef.current.offsetHeight;
    }

    setDistanceTop(`${Math.ceil(serviceHeight / 10) - step_size + step_default_gap}rem`);
    setDistanceBottom(`${Math.ceil(patientHeight / 10) - step_size + step_default_gap}rem`);
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setBookingDetail(bookingDetailAll[page] || []);
  }, [page]);

  const handleBanBookingDetail = async ({ id, status }) => {
    try {
      const { code, message } = await axios.put(`${API_ROUTES.bookingDetails}/status`, {
        bookingDetailID: id,
        status
      });

      if (+code === API_CODE.OK) {
        toast.success(message);
        fetchData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleHasEdit = () => {
    const { date, keyTime } = data;
    if (compareDate(NOW, date)) {
      if (moment(SCHEDULE_TIMER[keyTime + 1], 'h:mm').isAfter(moment(`${NOW.hour()}:${NOW.minute()}`, 'h:mm')))
        return true;
    } else if (NOW.isBefore(moment(date))) {
      return true;
    }
    return false;
  };

  const renderStatus = (keyTime, date, status) => {
    let label = '';
    let color = '';
    const time = SCHEDULE_TIMER[keyTime + 1];

    if (STATUS_CODE[status] !== 'done')
      return (
        <Text color="red.200" fontSize="1.4rem" fontWeight="500" textTransform="capitalize">
          canceled
        </Text>
      );

    if (moment(time, 'h:mm').isSameOrAfter(moment(`${NOW.hour()}:${NOW.minute()}`, 'h:mm')) && compareDate(NOW, date)) {
      label = 'on-going';
      color = 'purple.300';
    } else if (
      NOW.isBefore(moment(date)) &&
      moment(time, 'h:mm').isSameOrBefore(moment(`${NOW.hour()}:${NOW.minute()}`, 'h:mm'))
    ) {
      label = 'pending';
      color = 'yellow.500';
    } else if (
      NOW.isAfter(moment(date)) &&
      moment(time, 'h:mm').isSameOrBefore(moment(`${NOW.hour()}:${NOW.minute()}`, 'h:mm'))
    ) {
      label = 'completed';
      color = 'green';
    }

    return (
      <Text color={color} fontSize="1.4rem" fontWeight="500" textTransform="capitalize">
        {label}
      </Text>
    );
  };

  const dentistTemplate = (dentist) => {
    return (
      <Flex justify="space-between" align="center">
        <Flex align="center" gap="1.5rem">
          <Avatar src={dentist.imageUrl} name={`${dentist.lastName} ${dentist.firstName}`} w="5rem" h="5rem" />
          <Flex direction="column" align="flex-start" justify="flex-start">
            <Flex align="center" gap="1.5rem">
              <Heading fontSize="2rem" textTransform="capitalize">
                {`${dentist.lastName} ${dentist.firstName}`}
              </Heading>
              <Text
                p="0.8rem 1.5rem"
                bg="primary.20"
                borderRadius="0.8rem"
                fontSize="1.2rem"
                textTransform="capitalize"
                lineHeight="1"
              >
                {USER_POSITION[dentist.position]}
              </Text>
            </Flex>
            <Text color="grey.300" fontWeight="400" fontSize="1.4rem">
              {dentist.email}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const statusDropdownTemplate = (option, props) =>
    option ? (
      <Badge variant={option} fontSize="0.75rem">
        {option}
      </Badge>
    ) : (
      props?.placeholder
    );

  const renderServiceInfo = ({ services, id, status }, idx, isAction) => (
    <Flex key={idx} align="center" justify="space-between" p="1rem 2rem" _hover={{ bg: 'primary.50' }}>
      <Flex direction="column" gap="0.5rem">
        <Heading fontSize="1.6rem" fontWeight="700" textTransform="capitalize">
          {services.serviceName}
        </Heading>
        <Text fontSize="1.4rem" color="grey.300" fontWeight="600">
          Price: {services.price}
        </Text>
        <Text fontSize="1.4rem" color="grey.300" fontWeight="600">
          <Text as="span">Status: </Text>
          <Text as="span" color={statusColor[STATUS_CODE[status]]}>
            {STATUS_CODE[status]}
          </Text>
        </Text>
      </Flex>

      {isAction && STATUS_CODE[status] !== 'declined' && (
        <Button
          variant="outline"
          color={STATUS_CODE[status] === 'declined' ? 'green.400' : 'red.200'}
          _hover={{
            bg: STATUS_CODE[status] === 'declined' ? 'green.400' : 'red.200',
            color: 'white'
          }}
          onClick={() => {
            const statusCodeInvert = _.invert(STATUS_CODE);
            handleBanBookingDetail({
              id,
              status: +statusCodeInvert.declined
            });
          }}
        >
          <FaBan />
        </Button>
      )}

      {isAction && STATUS_CODE[status] === 'declined' && (
        <>
          {statusEditing?.id !== id ? (
            <Button
              variant="outline"
              color="yellow.500"
              _hover={{
                bg: 'yellow.500',
                color: 'white'
              }}
              onClick={() => setStatusEditing({ id })}
            >
              <MdModeEditOutline />
            </Button>
          ) : (
            <Dropdown
              itemTemplate={statusDropdownTemplate}
              options={_.values(STATUS_CODE).filter((item) => item !== 'declined' && item !== 'inActive')}
              onChange={(e) => {
                const statusCodeInvert = _.invert(STATUS_CODE);
                handleBanBookingDetail({
                  id,
                  status: +statusCodeInvert[e.value]
                });
              }}
              placeholder="Select a Status"
              style={{
                backgroundColor: 'transparent'
              }}
            />
          )}
        </>
      )}
    </Flex>
  );

  const renderDateTimeInfo = (item, idx) => (
    <Flex
      key={idx}
      direction="column"
      px="2rem"
      py="1rem"
      _hover={{
        bg: 'primary.50'
      }}
      gap="0.5rem"
    >
      <Flex justify="space-between" align="center">
        <Heading textTransform="capitalize" fontSize="1.6rem">
          {moment(data.date).format(DATE_FORMAT['dddd, DD MMMM YYYY'])}
        </Heading>
        <Text fontSize="1.4rem" fontWeight="500" lineHeight="1">
          {`${SCHEDULE_TIMER[item.keyTime]} - ${SCHEDULE_TIMER[item.keyTime + 1]}`}
        </Text>
      </Flex>

      {renderStatus(item.keyTime, data.date, item.status)}
    </Flex>
  );

  const renderDropdownItem = (data, flag) => {
    return (
      <Flex direction="column" py="1rem">
        <Heading
          mb="0.5rem"
          pb="0.5rem"
          borderColor="grey.200"
          borderBottom="1px solid"
          fontSize="1.5rem"
          mx="2rem"
          textTransform="capitalize"
          letterSpacing="0.2rem"
        >
          {flag === 'service' ? 'Service' : 'Date & time'} Information
        </Heading>
        {flag === 'service' ? renderServiceInfo(data) : renderDateTimeInfo(data)}
      </Flex>
    );
  };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay zIndex="1" />
      <ModalContent minW="40vw" minH="85vh">
        {loading && <Loading position="absolute" />}
        <ModalHeader bg="#F4F4FA" px="3rem">
          <Flex py="2rem" direction="column">
            <Text pb="2rem" borderBottom="1px solid" borderColor="grey.200" fontWeight="800">
              Appointment: {data.id}
            </Text>

            <Box pt="3rem" pb="1rem">
              <Carousel
                page={page}
                value={dentist}
                numVisible={1}
                numScroll={1}
                itemTemplate={dentistTemplate}
                indicatorsContentClassName={cx('indicators-carousel')}
                onPageChange={(e) => setPage(e.page)}
              />
            </Box>
          </Flex>
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody className={cx('modal-body')}>
          <Box flex="1" position="relative">
            <Flex
              flex="1"
              pt="2rem"
              pb="1rem"
              px="3rem"
              gap="2rem"
              position="absolute"
              inset="0"
              h="100%"
              w="100%"
              overflowY="auto"
              className="hide-scrollbar"
            >
              <Flex direction="column" mt="2rem">
                <Circle
                  boxSize={`${step_size}rem`}
                  bg={bookingDetail.length > 0 ? 'green.400' : 'primary.50'}
                  color={bookingDetail.length > 0 && 'white'}
                  fontSize="1.5rem"
                >
                  1
                </Circle>
                <Circle
                  position="relative"
                  sx={{
                    '&::before': {
                      content: '" "',
                      position: 'absolute',
                      bottom: '100%',
                      w: '0.5rem',
                      h: distanceTop,
                      bg: 'grey.100'
                    },
                    '&::after': {
                      content: '" "',
                      position: 'absolute',
                      top: '100%',
                      w: '0.5rem',
                      h: distanceBottom,
                      bg: 'grey.100'
                    }
                  }}
                  boxSize={`${step_size}rem`}
                  bg={patient ? 'green.400' : 'primary.50'}
                  color={patient && 'white'}
                  fontSize="1.5rem"
                  mt={distanceTop}
                  mb={distanceBottom}
                >
                  2
                </Circle>
                <Circle
                  boxSize={`${step_size}rem`}
                  bg={bookingDetail.length > 0 ? 'green.400' : 'primary.50'}
                  color={bookingDetail.length > 0 && 'white'}
                  fontSize="1.5rem"
                >
                  3
                </Circle>
              </Flex>

              <Flex direction="column" flex="1" gap={`${step_default_gap}rem`} h="fit-content">
                <Box
                  ref={servicesRef}
                  borderRadius="1.2rem"
                  p="2rem 0"
                  border="1px solid"
                  borderColor="rgba(100, 100, 111, 0.2)"
                  boxShadow="rgba(100, 100, 111, 0.2) 0px 2px 3px 0px"
                >
                  <Heading textTransform="uppercase" mb="1.5rem" fontSize="1.3rem" px="2rem" fontWeight="900">
                    Services information
                  </Heading>

                  <Flex direction="column">
                    {bookingDetail.map((item, idx) => (
                      <Propper
                        key={idx}
                        placement="bottom-end"
                        dropdown={renderDropdownItem(item, 'dateTime')}
                        minW="45rem"
                      >
                        {renderServiceInfo(item, idx, handleHasEdit())}
                      </Propper>
                    ))}
                  </Flex>
                </Box>

                <Box
                  ref={patientsRef}
                  borderRadius="1.2rem"
                  p="2rem 0 1rem"
                  border="1px solid"
                  borderColor="rgba(100, 100, 111, 0.2)"
                  boxShadow="rgba(100, 100, 111, 0.2) 0px 2px 3px 0px"
                >
                  <Heading textTransform="uppercase" mb="1.5rem" fontSize="1.3rem" px="2rem" fontWeight="900">
                    Patient information
                  </Heading>

                  {patient && (
                    <Flex align="flex-start" justify="flex-start" p="1rem 2rem" gap="1.5rem">
                      <Avatar
                        src={patient.imageUrl}
                        name={`${patient.firstName} ${patient.lastName}`}
                        w="6rem"
                        h="6rem"
                      />
                      <Flex direction="column" flex="1">
                        <Text
                          fontSize="1.6rem"
                          fontWeight="700"
                          textTransform="capitalize"
                          mb="1rem"
                          pb="0.5rem"
                          borderBottom="1px solid"
                          borderColor="grey.200"
                          letterSpacing="0.2rem"
                        >
                          {`${patient.firstName} ${patient.lastName}`}
                        </Text>

                        <Flex w="100%" fontSize="1.4rem">
                          <Text flex="0.2" textTransform="capitalize" fontWeight="800">
                            email
                          </Text>
                          <Text flex="1" fontSize="1.4rem" color="grey.300">
                            {patient.email}
                          </Text>
                        </Flex>

                        <Flex w="100%" fontSize="1.4rem" my="1rem">
                          <Text flex="0.2" textTransform="capitalize" fontWeight="800">
                            phone
                          </Text>
                          <Text flex="1" fontSize="1.4rem" color="grey.300">
                            {patient.phone}
                          </Text>
                        </Flex>

                        <Flex w="100%" fontSize="1.4rem">
                          <Text flex="0.2" textTransform="capitalize" fontWeight="800">
                            gender
                          </Text>
                          <Text flex="1" fontSize="1.4rem" color="grey.300">
                            {USER_SEXUAL[patient.gender]}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  )}
                </Box>

                <Box
                  borderRadius="1.2rem"
                  p="2rem 0"
                  border="1px solid"
                  borderColor="rgba(100, 100, 111, 0.2)"
                  boxShadow="rgba(100, 100, 111, 0.2) 0px 2px 3px 0px"
                >
                  <Heading textTransform="uppercase" mb="2rem" fontSize="1.3rem" px="2rem" fontWeight="900">
                    time & date
                  </Heading>

                  <Flex direction="column">
                    {bookingDetail.map((item, idx) => (
                      <Propper
                        key={idx}
                        placement="bottom-end"
                        dropdown={renderDropdownItem(item, 'service')}
                        minW="40rem"
                      >
                        {renderDateTimeInfo(item, idx)}
                      </Propper>
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            as={motion.button}
            size="lg"
            variant="primary"
            mr={3}
            onClick={onClose}
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 1.1 }}
            color="white"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default withTranslation()(DetailModal);
