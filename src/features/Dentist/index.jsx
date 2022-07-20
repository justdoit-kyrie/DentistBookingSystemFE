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
import { useParams } from 'react-router-dom';
import { axios } from '~/apis';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { init, selectLoggedUser } from '../Auth/authSlice';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const DentistPage = ({ t }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectLoggedUser);
  const [selectedDate, setSelectedDate] = useState(null);
  const dentistID = useParams();
  const ref = useRef();
  const { colorMode } = useColorMode();
  const [profile, setProfile] = useState();
  const [clinicProfile, setClinicProfile] = useState();
  const [dayList, setDayList] = useState([]);
  const [timeSelect, setTimeSelect] = useState();
  const [servicesList, setServicesList] = useState();
  const [showPrice, setShowPrice] = useState();

  const schema = yup.object({}).required();

  const datetest = new Date();

  const onTimeChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dropdownList];
    list[index][name] = value;
    setDropDownList(list);
  };

  const onDateChange = (e) => {
    setSelectedDate(e.value);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const onServiceChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...dropdownList];
    list[index][name] = value;
    setDropDownList(list);
    const totalPrice = dropdownList
      .map(function (a) {
        return a.service.price;
      })
      .reduce((partialSum, a) => partialSum + a, 0);
    setShowPrice(formatCurrency(totalPrice));
  };

  const [dropdownList, setDropDownList] = useState([{ keyTimes: '', service: '' }]);

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...dropdownList];
    list.splice(index, 1);
    setDropDownList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setDropDownList([...dropdownList, { keyTimes: '', service: '' }]);
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
    setClinicProfile({ ...data.clinicDTO });
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

  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    dispatch(init());

    const timeSelect = dropdownList.map(function (a) {
      return SCHEDULE_TIMER.indexOf(a.keyTimes);
    });
    const serviceSelect = dropdownList.map(function (a) {
      return a.service.id;
    });

    const totalPrice = dropdownList
      .map(function (a) {
        return a.service.price;
      })
      .reduce((partialSum, a) => partialSum + a, 0);

    try {
      const { code, message } = await axios.post(`${API_ROUTES['bookings']}`, {
        ...data,
        dentistIds: [profile.dentistID],
        userId: userInfo.id,
        date: revertDate(selectedDate),
        note: data.note,
        keyTimes: timeSelect,
        serviceIds: serviceSelect,
        total: totalPrice
      });
      if (+code === API_CODE.OK) {
        toast.success(message);
        setTimeout(function () {
          window.location.reload(1);
        }, 2000);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error);
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
          {profile && clinicProfile && (
            <Breadcrumb spacing="0.8rem" separator={<BsChevronRight color="gray.500" />} fontSize="1.5rem">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <BsHouseFill />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{clinicProfile.name}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href="#" isCurrentPage>
                  {profile.firstName + ' ' + profile.lastName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          )}
        </Box>

        {profile && (
          <Flex p="2rem 0 0 0" className="bs-avatar">
            <Avatar
              className="doctor-avatar"
              src={profile.imageUrl}
              name={profile.firstName + ' ' + profile.lastName}
            />
            <Box p="0 0 0 3rem" maxW="60%">
              <Flex className="bs-info">
                <Heading fontSize="5rem">{t('home.dentist.booking.doctor')}</Heading>
                <Heading fontSize="5rem" marginLeft="1.5rem">
                {profile.firstName + ' ' + profile.lastName}
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

                <Box width="100%">
                  {dropdownList.map((x, i) => {
                    return (
                      <Flex marginBottom="1rem" key={i}>
                        <Controller
                          name="keyTimes"
                          control={control}
                          render={({ field }) => (
                            <Dropdown
                              {...field}
                              className="date-dropdown"
                              panelClassName="date-dropdown-list"
                              placeholder={t('home.dentist.booking.timepickerPlaceholder')}
                              value={x.keyTimes}
                              options={timeSelect}
                              onChange={(e) => onTimeChange(e, i)}
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
                              value={x.service}
                              options={servicesList}
                              optionLabel="serviceName"
                              onChange={(e) => onServiceChange(e, i)}
                            />
                          )}
                        />
                        {dropdownList.length !== 1 && (
                          <Button
                            colorScheme="blue"
                            className="remove-btn"
                            size="lg"
                            onClick={() => handleRemoveClick(i)}
                          >
                            {t('home.dentist.booking.Remove')}
                          </Button>
                        )}
                        {servicesList && dropdownList.length - 1 === i && dropdownList.length < servicesList.length && (
                          <Button colorScheme="blue" className="add-btn" size="lg" onClick={handleAddClick}>
                            {t('home.dentist.booking.addMore')}
                          </Button>
                        )}
                      </Flex>
                    );
                  })}
                </Box>
              </Flex>
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
              <Flex>
                <Box className="price-box">
                  {t('home.dentist.booking.totalPrice')}: {showPrice}
                </Box>
                <Button colorScheme="blue" className="booking-btn" size="lg" type="submit">
                  {t('home.dentist.booking.bookingNow')}
                </Button>
              </Flex>
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
            {profile && (
              <Heading fontSize="2.5rem" marginLeft="1.5rem">
                {profile.firstName + ' ' + profile.lastName}
              </Heading>
            )}
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
