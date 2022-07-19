import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  Grid,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  useMediaQuery
} from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import _ from 'lodash';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsAlarm } from 'react-icons/bs';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdModeEditOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import {
  API_CODE,
  API_ROUTES,
  BOOKING_STATUS,
  DATE_FORMAT,
  MONTH,
  MONTH_VALUE,
  SCHEDULE_TIMER,
  SCHEDULE_WEEK,
  STATUS_CODE
} from '~/app/constants';
import { Dropdown, Loading } from '~/components';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import { compareDate, getDaysInMonth, getDaysInWeek } from '~/utils';
import { ProfileTemplate } from '../../Templates';
import styles from './Appointment.module.scss';
import './Appointment.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = (t) => ({
  navItems: [
    { label: t('dashboard.dentist.appointment.subTittle.0'), value: 'day' },
    { label: t('dashboard.dentist.appointment.subTittle.1'), value: 'week' },
    { label: t('dashboard.dentist.appointment.subTittle.2'), value: 'month' }
  ],
  calendar: {
    gridLine: {
      week: [
        {
          label: SCHEDULE_WEEK(t)[1],
          line: 2
        },
        {
          label: SCHEDULE_WEEK(t)[2],
          line: 3
        },
        {
          label: SCHEDULE_WEEK(t)[3],
          line: 4
        },
        {
          label: SCHEDULE_WEEK(t)[4],
          line: 5
        },
        {
          label: SCHEDULE_WEEK(t)[5],
          line: 6
        },
        {
          label: SCHEDULE_WEEK(t)[6],
          line: 7
        },
        {
          label: SCHEDULE_WEEK(t)[0],
          line: 8
        }
      ],
      month: [
        {
          label: SCHEDULE_WEEK(t)[1],
          day: 1,
          line: 1
        },
        {
          label: SCHEDULE_WEEK(t)[2],
          day: 2,
          line: 2
        },
        {
          label: SCHEDULE_WEEK(t)[3],
          day: 3,
          line: 3
        },
        {
          label: SCHEDULE_WEEK(t)[4],
          day: 4,
          line: 4
        },
        {
          label: SCHEDULE_WEEK(t)[5],
          day: 5,
          line: 5
        },
        {
          label: SCHEDULE_WEEK(t)[6],
          day: 6,
          line: 6
        },
        {
          label: SCHEDULE_WEEK(t)[0],
          day: 0,
          line: 7
        }
      ]
    },
    header: {
      base: [
        t('dashboard.dentist.appointment.table-header.monday'),
        t('dashboard.dentist.appointment.table-header.tuesday'),
        t('dashboard.dentist.appointment.table-header.wednesday'),
        t('dashboard.dentist.appointment.table-header.thursday'),
        t('dashboard.dentist.appointment.table-header.friday'),
        t('dashboard.dentist.appointment.table-header.saturday'),
        t('dashboard.dentist.appointment.table-header.sunday')
      ],
      week: [BsAlarm]
    },
    footer: [
      {
        label: t('dashboard.dentist.appointment.table-footer.ongoing'),
        value: 'ongoing',
        color: '#7a6efe' //purple.500
      },
      {
        label: t('dashboard.dentist.appointment.table-footer.success'),
        value: 'success',
        color: 'green'
      }
    ]
  },
  _constants: {
    _nav: {
      day: 'day',
      week: 'week',
      month: 'month'
    }
  }
});

const AppointmentPage = ({ t }) => {
  const {
    navItems,
    calendar,
    _constants: { _nav }
  } = MOCK_DATA(t);

  const userInfo = useSelector(selectLoggedUser);
  console.log({ userInfo });

  const BG = useColorModeValue('white', 'transparent');
  const disabledBg = useColorModeValue('grey.100', 'navy.500');
  const { colorMode } = useColorMode();
  const [isLessThan1919] = useMediaQuery('(max-width: 1919px)');

  const today = useRef(new Date());
  const dayCount = useRef(SCHEDULE_TIMER.length);
  const daysInWeek = useRef(getDaysInWeek());

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(today.current);
  const [dateOfMonth, setDateOfMonth] = useState(today.current);
  const [dateOfWeek, setDateOfWeek] = useState([
    daysInWeek.current[0],
    daysInWeek.current[daysInWeek.current.length - 1]
  ]);
  const [field, setField] = useState('month');
  const [data, setData] = useState([]);
  const [rowHeight, setRowHeight] = useState({ value: 200, num: 3 });

  const fetchData = async () => {
    console.log({ userInfo });

    try {
      switch (field) {
        case _nav.day: {
          const { code, content } = await axios.get(
            API_ROUTES['get-booking-by-dentist-it'].replace(':id', userInfo.dentistId),
            { params: { where: `day.${date.getDate()}.${MONTH_VALUE[date.getMonth()]}.${date.getFullYear()}` } }
          );

          if (+code === API_CODE.OK) {
            const result = content.reduce((initial, current) => [...initial, ...current.detail], []);
            setData(result.map((item) => ({ ...item, date: [moment(item.date).toDate()] })));
            setLoading(false);
          }
          break;
        }
        case _nav.week: {
          const { code, content } = await axios.get(
            API_ROUTES['get-booking-by-dentist-it'].replace(':id', userInfo.dentistId),
            {
              params: {
                where: `between.${dateOfWeek[0].getFullYear()}-${
                  MONTH_VALUE[dateOfWeek[0].getMonth()]
                }-${dateOfWeek[0].getDate()}.${dateOfWeek[1].getFullYear()}-${
                  MONTH_VALUE[dateOfWeek[1].getMonth()]
                }-${dateOfWeek[1].getDate()}`
              }
            }
          );

          if (+code === API_CODE.OK) {
            const result = content.reduce((initial, current) => [...initial, ...current.detail], []);
            setData(result.map((item) => ({ ...item, date: [moment(item.date).toDate()] })));
            setLoading(false);
          }
          break;
        }
        default: {
          const { code, content } = await axios.get(
            API_ROUTES['get-booking-by-dentist-it'].replace(':id', userInfo.dentistId),
            {
              params: {
                where: `month.${MONTH_VALUE[dateOfMonth.getMonth()]}.${dateOfMonth.getFullYear()}`
              }
            }
          );

          if (+code === API_CODE.OK) {
            const result = content.reduce((initial, current) => [...initial, ...current.detail], []);
            setData(result.map((item) => ({ ...item, date: [moment(item.date).toDate()] })));
            setLoading(false);
          }
          break;
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (userInfo) fetchData();
  }, [field, dateOfWeek, date, dateOfMonth]);

  const handleGetPositionTransform = (item, index, num) => {
    const hasList = data.filter((v, idx) => {
      return v.date.length > 1
        ? (compareDate(v.date[1], item.date[0]) || compareDate(v.date[0], item.date[0])) &&
            v.id !== item.id &&
            idx < index
        : compareDate(v.date[0], item.date[0]) && v.id !== item.id && idx < index;
    });
    if (hasList.length <= 0) return num;

    ++num;
    const _index = _.findIndex(data, function (o) {
      return o.id == hasList[hasList.length - 1].id;
    });

    return handleGetPositionTransform(hasList[hasList.length - 1], _index, num);
  };

  const getGridRow = (data) => {
    if (field === _nav.month) {
      const index = getDaysInMonth().findIndex(
        (item) =>
          item.getDate() === data.date[0].getDate() &&
          item.getMonth() === data.date[0].getMonth() &&
          item.getFullYear() === data.date[0].getFullYear()
      );
      const line = index % 7 === 0 ? Math.ceil(index / 7) + 1 : Math.ceil(index / 7);
      return `${line} / ${line + 1}`;
    }

    const line = data.keyTime;
    return `${line + 1} / ${line + 2}`;
  };

  const getGridColumn = (data) => {
    const { gridLine } = calendar;
    let lines = [];

    switch (field) {
      case _nav.month: {
        const listDay = data.date;

        if (listDay.length > 1) {
          lines.push(
            gridLine[field].find((item) => item.day === listDay[0].getDay()).line,
            gridLine[field].find((item) => item.day === listDay[1].getDay()).line + 1
          );
        } else {
          lines.push(
            gridLine[field].find((item) => item.day === listDay[0].getDay()).line,
            gridLine[field].find((item) => item.day === listDay[0].getDay()).line + 1
          );
        }

        return `${lines[0]} / ${lines[1]}`;
      }

      case _nav.week: {
        const listDay = data.date;
        if (listDay.length > 1) {
          lines.push(
            gridLine[field].find((item) => item.label === SCHEDULE_WEEK(t)[listDay[0].getDay()]).line,
            gridLine[field].find((item) => item.label === SCHEDULE_WEEK(t)[listDay[1].getDay()]).line
          );
        } else {
          lines.push(
            gridLine[field].find((item) => item.label === SCHEDULE_WEEK(t)[listDay[0].getDay()]).line,
            gridLine[field].find((item) => item.label === SCHEDULE_WEEK(t)[listDay[0].getDay()]).line
          );
        }

        return `${lines[0]} / ${lines[1] + 1}`;
      }
    }
    return '2 / 3';
  };

  const renderTitle = () => {
    switch (field) {
      case _nav.week:
        return MONTH(t)[dateOfWeek[0].getMonth()];
      case _nav.month:
        return MONTH(t)[dateOfMonth.getMonth()];
      default:
        return MONTH(t)[date.getMonth()];
    }
  };

  const handleAcceptBookingDetail = async (item) => {
    try {
      const invert = _.invert(STATUS_CODE);
      const { code, message } = await axios.put(`${API_ROUTES.bookingDetails}/status`, {
        bookingDetailID: item.id,
        status: +invert.done
      });

      if (+code === API_CODE.OK) {
        toast.success(message);
        fetchData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderDropdownItem = (item) => {
    return (
      <Flex direction="column" gap="2rem" p="1rem 2rem" minW="40rem">
        <Flex align="center" justify="space-between">
          <ProfileTemplate titleColor="black" user={item.user} />
          <Flex gap="1rem" color="black">
            <Circle
              as={motion.div}
              size="4rem"
              p="1rem"
              bg="black.200"
              cursor="pointer"
              whileTap={{
                scale: 0.9
              }}
              whileHover={{
                scale: 1.1
              }}
              onClick={() => {
                handleAcceptBookingDetail(item);
              }}
            >
              <MdModeEditOutline fontSize="3rem" />
            </Circle>
          </Flex>
        </Flex>
        <Flex align="center" justify="space-between" pt="1rem" borderTop="1px solid" borderColor="grey.200">
          <Flex align="center" gap="0.5rem" fontSize="1.5rem" fontWeight="800" color="black">
            {field === 'month' ? (
              <>
                <BsAlarm fontSize="2.5rem" />
                <Text>{SCHEDULE_TIMER[item.keyTime]}</Text>
              </>
            ) : (
              <>
                <AiOutlineCalendar />
                <Text>
                  {item.date.length > 1
                    ? `${moment(item.date[0]).format(DATE_FORMAT['DD-MM-YYYY'])} - ${moment(item.date[1]).format(
                        DATE_FORMAT['DD-MM-YYYY']
                      )}`
                    : `${moment(item.date[0]).format(DATE_FORMAT['DD-MM-YYYY'])}`}
                </Text>
              </>
            )}
          </Flex>
          <Flex align="center" gap="0.5rem">
            <GoPrimitiveDot fontSize="1.5rem" color={BOOKING_STATUS(t)[item.status].color} />
            <Text textTransform="uppercase" fontSize="1.25rem" color="grey.300" fontWeight="700">
              {BOOKING_STATUS(t)[item.status].label}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const renderData = () =>
    data.map((item, index) => {
      const num = handleGetPositionTransform(item, index, 0);
      const passProps = {};
      const namePassProps =
        field === _nav.day ? {} : { maxW: '50%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' };

      if (field === _nav.month) {
        passProps.transform = num > 0 ? `translateY(${num * 120}%)` : 'translateY(0)';
        if (num > rowHeight.num) {
          setRowHeight({ value: 33 * (num + 1) + 80, num });
        }
      }

      console.log({ item });

      return (
        <Flex
          key={`${index}`}
          position="absolute"
          gridRow={getGridRow(item)}
          gridColumn={getGridColumn(item)}
          h="100%"
          w="100%"
          direction="column"
          justify={field === _nav.month ? 'flex-start' : 'center'}
          align="center"
          pt={field === _nav.month ? '3.5rem' : '0'}
        >
          <Dropdown placement="bottom-start" dropdown={renderDropdownItem(item)} offset={[30, 10]}>
            <Flex
              sx={{
                '@media screen and (max-width: 1919px)': {
                  fontSize: '1rem'
                },
                '@media screen and (max-width: 1439px)': {
                  fontSize: '0.8rem'
                }
              }}
              justify="space-between"
              align="center"
              w={field === _nav.day ? '95%' : '90%'}
              h={field === _nav.month ? '33px' : '60%'}
              borderRadius="2rem"
              bg={BOOKING_STATUS(t)[item.status].color}
              px="1rem"
              color="white"
              fontSize="1.2rem"
              position="relative"
              zIndex={index}
              {...passProps}
            >
              <Text textTransform="uppercase" {...namePassProps}>
                {item.serviceName}
              </Text>
              <Text>{SCHEDULE_TIMER[item.keyTime]}</Text>
            </Flex>
          </Dropdown>
        </Flex>
      );
    });

  const renderContent = () => {
    if (field === _nav.month) {
      const days = getDaysInMonth();
      return (
        <>
          <Flex justify="space-between" minH="70px">
            {calendar.header.base.map((item, index) => (
              <Flex flex="1" key={`${index}`} justify="center" align="center" className={cx('schedule-header')}>
                <Text
                  sx={{
                    '@media screen and (max-width: 1919px)': {
                      fontSize: '1.3rem'
                    }
                  }}
                  textTransform="capitalize"
                  fontSize="1.5rem"
                  fontWeight="500"
                >
                  {item}
                </Text>
              </Flex>
            ))}
          </Flex>

          <Box flex="1" position="relative">
            <Grid
              w="auto"
              h="100%"
              gridTemplateColumns="repeat(7, 1fr)"
              gridTemplateRows={`repeat(${Math.ceil(days.length / 7)}, minmax(${rowHeight.value}px, 1fr))`}
              overflowY="auto"
              position="absolute"
              inset="0"
              className="hide-scrollbar"
            >
              {days.map((item, index) => (
                <Flex
                  key={`${index}`}
                  justify="flex-start"
                  align="flex-end"
                  className={cx('schedule-body')}
                  direction="column"
                  pt="1rem"
                  gap="1rem"
                  bg={item.getMonth() !== today.current.getMonth() ? disabledBg : BG}
                >
                  <Text flex="0.2" fontSize="1.5rem" fontWeight="600" pr="2.5rem">
                    {item.getDate()}
                  </Text>
                </Flex>
              ))}

              {loading ? <Loading position="absolute" /> : renderData()}
            </Grid>
          </Box>
        </>
      );
    }

    const rest =
      field === _nav.week
        ? calendar.header.base
        : [
            calendar.header.base[
              today.current.getDay() === 0 ? calendar.header.base.length - 1 : today.current.getDay() - 1
            ]
          ];
    return (
      <>
        <Flex justify="space-between" minH="70px">
          {[...calendar.header.week, ...rest].map((item, index) => {
            const Comp = item;
            return (
              <Flex
                flex={typeof Comp === 'string' && '1'}
                key={`${index}`}
                justify="center"
                align="center"
                className={cx('schedule-header')}
              >
                {typeof Comp === 'string' ? (
                  <Text
                    sx={{
                      '@media screen and (max-width: 1919px)': {
                        fontSize: '1.3rem'
                      }
                    }}
                    textTransform="capitalize"
                    fontSize="1.5rem"
                    fontWeight="500"
                  >
                    {item}
                  </Text>
                ) : (
                  <Center minW="6.9rem">
                    <Comp fontSize={isLessThan1919 ? '2rem' : '3rem'} />
                  </Center>
                )}
              </Flex>
            );
          })}
        </Flex>

        <Box flex="1" position="relative">
          <Grid
            w="auto"
            h="100%"
            gridTemplateColumns={`70px ${field === _nav.week ? ' repeat(7, 1fr)' : '1fr'}`}
            gridTemplateRows={`repeat(${dayCount.current}, minmax(70px, 1fr))`}
            overflowY="auto"
            position="absolute"
            inset="0"
            className="hide-scrollbar"
          >
            {SCHEDULE_TIMER.map((item, index) => (
              <Flex
                key={`${index}`}
                justify="center"
                align="center"
                className={cx('schedule-body')}
                direction="column"
                cursor="pointer"
                py="1rem"
                gap="1rem"
                gridRow={`${index + 1} / ${index + 2}`}
              >
                <Text flex="0.2" fontSize="1.5rem" fontWeight="600">
                  {item}
                </Text>
              </Flex>
            ))}

            {[...new Array(field === _nav.week ? dayCount.current * 7 : dayCount.current)].map((_, index) => (
              <Box key={`${index}`} className={cx('schedule-body')} />
            ))}

            {loading ? <Loading position="absolute" /> : renderData()}
          </Grid>
        </Box>
      </>
    );
  };

  const renderCalendar = () => {
    switch (field) {
      case _nav.month:
        return (
          <Calendar
            className="appointment-calendar"
            panelClassName={colorMode === 'light' ? 'appointment-calendar-panel' : 'appointment-calendar-panel dark'}
            value={dateOfMonth}
            onChange={(e) => setDateOfMonth(e.value)}
            readOnlyInput
            dateFormat="There is: MM"
            view="month"
            yearNavigator
            yearRange={`${moment(today.current).subtract(10, 'years').toDate().getFullYear()}:${moment(today.current)
              .add(1, 'years')
              .toDate()
              .getFullYear()}`}
          />
        );
      case _nav.week: {
        return (
          <Calendar
            view="date"
            selectionMode="range"
            value={dateOfWeek}
            className="appointment-calendar"
            panelClassName={colorMode === 'light' ? 'appointment-calendar-panel' : 'appointment-calendar-panel dark'}
            onChange={(e) => {
              const daysInWeek = getDaysInWeek(e.value[0]);
              setDateOfWeek([daysInWeek[0], daysInWeek[daysInWeek.length - 1]]);
            }}
            dateFormat={DATE_FORMAT['dd/mm/yy']}
            readOnlyInput
            yearNavigator
            yearRange={`${moment(today.current).subtract(10, 'years').toDate().getFullYear()}:${moment(today.current)
              .add(1, 'years')
              .toDate()
              .getFullYear()}`}
          />
        );
      }

      default:
        return (
          <Calendar
            className="appointment-calendar"
            panelClassName={colorMode === 'light' ? 'appointment-calendar-panel' : 'appointment-calendar-panel dark'}
            view="date"
            value={date}
            onChange={(e) => setDate(e.value)}
            readOnlyInput
            yearNavigator
            dateFormat={DATE_FORMAT['dd/mm/yy']}
            yearRange={`${moment(today.current).subtract(10, 'years').toDate().getFullYear()}:${moment(today.current)
              .add(1, 'years')
              .toDate()
              .getFullYear()}`}
          />
        );
    }
  };

  return (
    <>
      <Heading color="primary.500" textTransform="capitalize">
        {t('dashboard.dentist.appointment.title')}
      </Heading>

      <Flex justify="space-between" align="center" my="1.5rem">
        <Box flex="0.8">{renderCalendar()}</Box>

        <Flex flex="2" justify="center" align="center">
          <Heading textTransform="uppercase" fontSize="1.5rem" letterSpacing="0.5rem">
            {renderTitle()}
          </Heading>
        </Flex>

        <Flex h="100%" border="1px solid" borderColor="grey.300" borderRadius="0.8rem" overflow="hidden">
          {navItems.map((item, index) => (
            <Button
              key={`${index}`}
              variant={field === item.value ? 'primary' : 'outline'}
              color={field === item.value ? 'white' : ''}
              w="10rem"
              py="1.5rem"
              border="none"
              borderLeft={index === navItems.length - 1 && '1px solid'}
              borderRight={index === 0 && '1px solid'}
              borderRightColor={colorMode === 'light' ? 'black !important' : 'grey.300'}
              borderLeftColor={colorMode === 'light' ? 'black !important' : 'grey.300'}
              borderRadius="0"
              h="100%"
              onClick={() => setField(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Flex
        flex="1"
        w="100%"
        h="100%"
        position="relative"
        direction="column"
        border="1px solid"
        borderRight="none"
        borderColor="grey.100"
        borderRadius="1.2rem"
        overflow="hidden"
        className="schedule"
      >
        {renderContent()}

        <Flex
          justify="flex-start"
          align="center"
          gap="5rem"
          className={cx('schedule-footer')}
          px="2rem"
          bg={colorMode === 'light' ? '#e1e1e1' : 'transparent'}
          minH="70px"
          borderTop="1px solid"
          borderRight="1px solid"
          borderColor="grey.100"
        >
          {calendar.footer.map((item, index) => (
            <Flex key={`${index}`} align="center" gap="0.5rem">
              <GoPrimitiveDot fontSize="1.5rem" color={item.color} />
              <Text
                textTransform="capitalize"
                fontSize="1.5rem"
                color={colorMode === 'light' ? 'grey.300' : 'white'}
                fontWeight="700"
              >
                {item.label}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default withTranslation()(AppointmentPage);
