/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Text,
  Textarea,
  useColorMode
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import HeaderOnlyLayout from '~/components/layouts/HeaderOnlyLayout';
import { BsHouseFill, BsChevronRight } from 'react-icons/bs';
import { Dropdown } from 'primereact/dropdown';
import './Dentist.scss';
import { withTranslation } from 'react-i18next';
import { MdCheckCircle } from 'react-icons/md';
import styles from './Dentist.module.scss';
import classNames from 'classnames/bind';
import { useRef } from 'react';
import { Footer } from '~/components';
import { API_CODE, API_ROUTES, SCHEDULE_TIMER } from '~/app/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { axios } from '~/apis';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { init, selectLoggedUser } from '../Auth/authSlice';
import * as yup from 'yup';

const cx = classNames.bind(styles);

const DentistPage = ({ t }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectLoggedUser);
  const [selectedDate, setSelectedDate] = useState(null);
  const dentistID = useParams();
  const ref = useRef();
  const { colorMode } = useColorMode();
  const [selectedTime, setSelectedTime] = useState(null);
  const [profile, setProfile] = useState();
  const [clinicProfile, setClinicProfile] = useState();
  const [dayList, setDayList] = useState([]);
  const [timeSelect, setTimeSelect] = useState();
  const [servicesList, setServicesList] = useState();
  const [selectedService, setSelectedService] = useState();

  const schema = yup.object({}).required();

  console.log(userInfo);

  const datetest = new Date();

  const onTimeChange = (e) => {
    setSelectedTime(e.value);
  };

  const onDateChange = (e) => {
    setSelectedDate(e.value);
  };

  const onServiceChange = (e) => {
    setSelectedService(e.value);
  };

  const defaultValues = {
    userId: '',
    dentistIds: [],
    serviceIds: [],
    keyTimes: [],
    total: 0,
    date: '',
    note: ''
  };

  const dentist = async () => {
    const data = await axios.get(API_ROUTES['get-dentist-profile'].replace(':id', dentistID.id));
    setProfile({ ...data.dentistDTO });
    setServicesList(data.dentistDTO.services);
    console.log(data.dentistDTO);
    setClinicProfile({ ...data.clinicDTO });
    console.log(data.clinicDTO);
  };

  const revertDate = (date) => {
    var momentVariable = moment(date, 'dddd DD/MM');
    return momentVariable.format('YYYY-MM-DD');
  };

  const timeList = async () => {
    var stringValue = revertDate(selectedDate);
    const data = await axios.get(API_ROUTES['get-available-bookings'], {
      params: {
        dentistId: profile.dentistID,
        date: stringValue
      }
    });
    const timeList = data.map(function (element) {
      return SCHEDULE_TIMER[element];
    });
    setTimeSelect(timeList);
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    dispatch(init());
    const serviceDetail = await axios.get(API_ROUTES['get-service-by-id'].replace(':id',selectedService.id));
    console.log(serviceDetail);
    try {
      const { code } = await axios.post(`${API_ROUTES['bookings']}`, {
        ...data,
        dentistIds: [profile.dentistID],
        userId: userInfo.id,
        date: revertDate(selectedDate),
        note: data.note,
        keyTimes: [SCHEDULE_TIMER.indexOf(selectedTime)],
        serviceIds: [selectedService.id],
        total: serviceDetail.service.price
      });
      if (+code === API_CODE.OK) {
        console.log(code);
      } else {
        console.log(code);
      }
    } catch (error) {
      // show toast
      console.log(error);
    }
  };

  useEffect(() => {
    timeList();
  }, [selectedDate]);


  

  useEffect(() => {
    dentist();
    
    const handler = () => {
      const innerEle = ref.current;
      const scrollPos = window.pageYOffset;
      const innerHeight = innerEle.offsetHeight;

      if (scrollPos > innerHeight) {
        if (!innerEle.classList.contains(cx('scrolled'))) {
          innerEle.classList.add(cx('scrolled'));
        }
      }
      if (scrollPos < innerHeight) {
        if (innerEle.classList.contains(cx('scrolled'))) {
          innerEle.classList.remove(cx('scrolled'));
          innerEle.classList.remove(cx('sleep'));
        }
      }
      if (scrollPos > innerHeight * 2) {
        if (!innerEle.classList.contains(cx('awake'))) {
          innerEle.classList.add(cx('awake'));
        }
      }
      if (scrollPos < innerHeight * 2) {
        if (innerEle.classList.contains(cx('awake'))) {
          innerEle.classList.remove(cx('awake'));
          innerEle.classList.add(cx('sleep'));
        }
      }
    };
    document.addEventListener('scroll', handler);

    return () => {
      document.removeEventListener('scroll', handler);
    };
  }, []);

  useEffect(() => {
    const today = datetest.getDate();
    const dayOfWeek = datetest.getDay();
    const dayList = [];
    if (dayOfWeek === 6) {
      let tmp = 1;
      let count = 2;
      while (tmp < 6) {
        let addDay = datetest.setDate(today + count);
        dayList.push(moment(addDay).format('dddd DD/MM'));
        count++;
        tmp++;
      }
      setDayList(dayList);
    } else if (dayOfWeek === 0) {
      let tmp = 1;
      let count = 1;
      while (tmp < 6) {
        let addDay = datetest.setDate(today + count);
        dayList.push(moment(addDay).format('dddd DD/MM'));
        count++;
        tmp++;
      }
      setDayList(dayList);
    } else {
      let tmp = dayOfWeek;
      let count = 1;
      while (tmp < 6) {
        let addDay = datetest.setDate(today + count);
        dayList.push(moment(addDay).format('dddd DD/MM'));
        count++;
        tmp++;
      }
      setDayList(dayList);
    }
  }, []);
  return (
    <Box className="booking-page-container">
      <div ref={ref} className={cx('header-wrapper', colorMode === 'light' ? '' : 'dark')}>
        <HeaderOnlyLayout />
      </div>
      <Box className="container doctor-intro" w="100%" h="100%" mt="2rem">
        <Box size="3rem">
          <Breadcrumb spacing="0.8rem" separator={<BsChevronRight color="gray.500" />} fontSize="1.5rem">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <BsHouseFill />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Docs</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#" isCurrentPage>
                Breadcrumb
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>

        {profile && (
          <Flex p="2rem 0 0 0" className="bs-avatar">
            <Avatar className="doctor-avatar" src={profile.imageUrl} />
            <Box p="0 0 0 3rem" maxW="60%">
              <Flex className="bs-info">
                <Heading fontSize="5rem">{t('home.dentist.booking.doctor')}</Heading>
                <Heading fontSize="5rem" marginLeft="1.5rem">
                  {profile.lastName + ' ' + profile.firstName}
                </Heading>
              </Flex>
              <Box fontSize="1.5rem" dangerouslySetInnerHTML={{ __html: profile.description }} />
            </Box>
          </Flex>
        )}

        <Flex marginTop="2rem" className="bs-detail-info">
          <Box className="booking-section" w="60%">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Dropdown
                        {...field}
                        className="date-dropdown"
                        panelClassName="date-dropdown-list"
                        placeholder={t('home.dentist.booking.daypickerPlaceholder')}
                        value={selectedDate}
                        options={dayList}
                        onChange={onDateChange}
                      />
                    );
                  }}
                />
                <Controller
                  name="keyTimes"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      className="date-dropdown"
                      panelClassName="date-dropdown-list"
                      placeholder={t('home.dentist.booking.timepickerPlaceholder')}
                      value={selectedTime}
                      options={timeSelect}
                      onChange={onTimeChange}
                    />
                  )}
                />
                <Controller
                  name="service"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      {...field}
                      className="date-dropdown"
                      panelClassName="date-dropdown-list"
                      placeholder={t('home.dentist.booking.servicepickerPlaceholder')}
                      value={selectedService}
                      options={servicesList}
                      optionLabel="serviceName"
                      onChange={onServiceChange}
                    />
                  )}
                />
                <Button colorScheme="blue" className="booking-btn" size="lg" type="submit">
                  {t('home.dentist.booking.bookingNow')}
                </Button>
              </Flex>
              <Box>
                <Controller
                  name="note"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="note-textarea"
                      placeholder={t('home.dentist.booking.notePlaceholder')}
                      size="sm"
                      resize="none"
                    />
                  )}
                />
              </Box>
            </form>
          </Box>

          {clinicProfile && (
            <Box className="clinic-info-wrapper">
              <Box className="info-container" w="100%" paddingBottom="2rem">
                <Accordion allowToggle className="clinic-location-accordion">
                  <AccordionItem className="clinic-accordion-item">
                    <h2>
                      <AccordionButton className="accordion-button">
                        <Box flex="1" textAlign="left">
                          <Heading fontSize="2rem">{t('home.dentist.booking.clinicInfo')}</Heading>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Box className="info-container" paddingBottom="2rem" paddingTop="1rem">
                        <Heading fontSize="2rem">{t('home.dentist.booking.clinicLocation')}</Heading>
                        <Text fontSize="1.7rem" fontweight="600">
                          {clinicProfile.name}
                        </Text>
                        <Text fontSize="1.3rem">{clinicProfile.address}</Text>
                      </Box>

                      <Box className="info-container" paddingBottom="2rem" paddingTop="1rem">
                        <HStack>
                          <Heading fontSize="2rem">{t('home.dentist.booking.phone')}</Heading>
                          <Text fontSize="1.7rem">{clinicProfile.phone}</Text>
                          {/* <Link to="/detail" fontSize="1.7rem" color="var(--chakra-colors-blue-500)">
                            Xem Chi Tiết
                          </Link> */}
                        </HStack>
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
      <Box className="container doctor-profile" w="100%" h="100%" mt="2rem">
        <Box className="doctor-profile-wrapper">
          <HStack>
            <Heading fontSize="2.5rem" marginRight="0.3rem">
              {t('home.dentist.booking.doctor')}
            </Heading>
            <Heading fontSize="2.5rem" marginLeft="1.5rem">
              Vladimir Putin
            </Heading>
          </HStack>
          <List spacing={3} fontSize="1.5rem" marginTop="1rem">
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Assumenda, quia temporibus eveniet a libero incidunt suscipit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
            </ListItem>
          </List>
        </Box>
        <Box className="doctor-profile-wrapper">
          <HStack>
            <Heading fontSize="2.5rem">{t('home.dentist.booking.trainingProcess')}</Heading>
          </HStack>
          <List spacing={3} fontSize="1.5rem" marginTop="1rem">
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Assumenda, quia temporibus eveniet a libero incidunt suscipit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
            </ListItem>
          </List>
        </Box>
        <Box className="doctor-profile-wrapper">
          <HStack>
            <Heading fontSize="2.5rem">{t('home.dentist.booking.workingProcess')}</Heading>
          </HStack>
          <List spacing={3} fontSize="1.5rem" marginTop="1rem">
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Assumenda, quia temporibus eveniet a libero incidunt suscipit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
            </ListItem>
          </List>
        </Box>
        <Box className="doctor-profile-wrapper">
          <HStack>
            <Heading fontSize="2.5rem">{t('home.dentist.booking.treatment')}</Heading>
          </HStack>
          <List spacing={3} fontSize="1.5rem" marginTop="1rem">
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Assumenda, quia temporibus eveniet a libero incidunt suscipit
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
            </ListItem>
          </List>
        </Box>
      </Box>

      <Box className="container clinic-policy" w="100%" h="100%" mt="2rem">
        <Accordion allowToggle className="clinic-accordion">
          <AccordionItem className="clinic-accordion-item">
            <h2>
              <AccordionButton className="accordion-button">
                <Box flex="1" textAlign="center" fontSize="3rem">
                  {t('home.dentist.booking.dentacareRole.title')}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box marginBottom="1rem">
                <Heading fontSize="2rem">{t('home.dentist.booking.dentacareRole.heading.1')}</Heading>
                <List spacing={3} fontSize="1.5rem" marginTop="1rem">
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.1')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.2')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.3')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.4')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.5')}
                  </ListItem>
                </List>
              </Box>
              <Box marginBottom="1rem">
                <Heading fontSize="2rem">{t('home.dentist.booking.dentacareRole.heading.2')}</Heading>
                <Text fontSize="2rem" marginTop="1rem">
                  {t('home.dentist.booking.dentacareRole.subTitle.before')}
                </Text>
                <List spacing={3} fontSize="1.5rem" marginTop="1rem">
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.6')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.7')}
                  </ListItem>
                </List>
                <Text fontSize="2rem" marginTop="1rem">
                  {t('home.dentist.booking.dentacareRole.subTitle.during')}
                </Text>
                <List spacing={3} fontSize="1.5rem" marginTop="1rem">
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.8')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.9')}
                  </ListItem>
                </List>
                <Text fontSize="2rem" marginTop="1rem">
                  {t('home.dentist.booking.dentacareRole.subTitle.after')}
                </Text>
                <List spacing={3} fontSize="1.5rem" marginTop="1rem">
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.10')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.11')}
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {t('home.dentist.booking.dentacareRole.subText.12')}
                  </ListItem>
                </List>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
      <Footer />
    </Box>
  );
};

export default withTranslation()(DentistPage);
