// eslint-disable-next-line no-unused-vars
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
  useColorMode
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import HeaderOnlyLayout from '~/components/layouts/HeaderOnlyLayout';
import { BsHouseFill, BsChevronRight, BsFillCheckCircleFill } from 'react-icons/bs';
import { Dropdown } from 'primereact/dropdown';
import './Dentist.scss';
import { Calendar } from 'primereact/calendar';
import { withTranslation } from 'react-i18next';
import { MdCheckCircle } from 'react-icons/md';
import styles from './Dentist.module.scss';
import classNames from 'classnames/bind';
import { useRef } from 'react';
import { Footer } from '~/components';

const cx = classNames.bind(styles);

const DentistPage = ({ t }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const ref = useRef();
  const { colorMode } = useColorMode();

  const onDateChange = (e) => {
    setSelectedDate(e.value);
  };
  const date = [
    { day: 'Monday - 10/6' },
    { day: 'Tuesday - 11/6' },
    { day: 'Wednesday - 12/6' },
    { day: 'Thursday - 13/6' }
  ];

  const [date1, setDate1] = useState(null);

  useEffect(() => {
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
  return (
    <Box>
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
        <Flex p="2rem 0 0 0" className="bs-avatar">
          <Image
            borderRadius="full"
            boxSize="150px"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vladimir_Putin_17-11-2021_%28cropped%29.jpg/220px-Vladimir_Putin_17-11-2021_%28cropped%29.jpg"
            alt="bac si"
          />
          <Box p="0 0 0 3rem" maxW="60%">
            <Flex className="bs-info">
              <Heading fontSize="5rem">{t('home.dentist.booking.doctor')}</Heading>
              <Heading fontSize="5rem" marginLeft="1.5rem">
                Vladimir Putin
              </Heading>
            </Flex>
            <Text fontSize="1.5rem">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum, facere. Blanditiis vitae consequuntur
              facere recusandae eum temporibus itaque autem velit. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Tenetur nihil consequuntur quos beatae commodi, repellendus cupiditate. Excepturi ratione officiis
              aperiam totam ab nulla nemo, dignissimos quaerat omnis placeat. Minima, dignissimos.
            </Text>
          </Box>
        </Flex>

        <Flex marginTop="2rem" className="bs-detail-info">
          <Flex w="40%">
            <Dropdown
              className="date-dropdown"
              panelClassName="date-dropdown-list"
              placeholder={t('home.dentist.booking.daypickerPlaceholder')}
              value={selectedDate}
              options={date}
              onChange={onDateChange}
              optionLabel="day"
            />
            <Calendar
              id="time12"
              className="primereact-time-picker"
              panelClassName="primereact-time-picker-panel"
              placeholder={t('home.dentist.booking.timepickerPlaceholder')}
              value={date1}
              onChange={(e) => setDate1(e.value)}
              timeOnly
              hourFormat="12"
              style={{
                marginLeft: '2rem'
              }}
            />
            <Button colorScheme="blue" className="booking-btn" size="lg">
              {t('home.dentist.booking.bookingNow')}
            </Button>
          </Flex>
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
                        Phòng Khám Đa Khoa NTKDD
                      </Text>
                      <Text fontSize="1.3rem">243 Chu Văn An, phường 12, quận Bình Thạnh, Tp.HCM</Text>
                    </Box>

                    <Box className="info-container" paddingBottom="2rem" paddingTop="1rem">
                      <HStack>
                        <Heading fontSize="2rem">{t('home.dentist.booking.price')}</Heading>
                        <Text fontSize="1.7rem">250.000đ.</Text>
                        <Link to="/detail" fontSize="1.7rem" color="var(--chakra-colors-blue-500)">
                          Xem Chi Tiết
                        </Link>
                      </HStack>
                    </Box>

                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Box>
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
      <Box className="container user-comment" w="100%" h="100%" mt="2rem">
        <Box className="comment-title">
          <Heading fontSize="3rem">{t('home.dentist.booking.commentTitles')}</Heading>
        </Box>
        <Box className="comment-wrapper">
          <Flex className="comment-user-name">
            <HStack>
              <Text fontSize="2rem" marginRight="0.5rem" fontWeight="bold">
                Bùi Đức Uy Dũng
              </Text>
              <BsFillCheckCircleFill fontSize="1.5rem" color="var(--chakra-colors-green-300)" />
              <Text fontSize="1.6rem" marginLeft="0.5rem" color="var(--chakra-colors-green-300)">
                Đã khám ngày 06/08/2021
              </Text>
            </HStack>
          </Flex>
          <Text fontSize="1.5rem">Dịch vụ tốt!</Text>
        </Box>
        <Box className="comment-wrapper">
          <Flex className="comment-user-name">
            <HStack>
              <Text fontSize="2rem" marginRight="0.5rem" fontWeight="bold">
                Bùi Đức Uy Dũng
              </Text>
              <BsFillCheckCircleFill fontSize="1.5rem" color="var(--chakra-colors-green-300)" />
              <Text fontSize="1.6rem" marginLeft="0.5rem" color="var(--chakra-colors-green-300)">
                Đã khám ngày 06/08/2021
              </Text>
            </HStack>
          </Flex>
          <Text fontSize="1.5rem">Dịch vụ tốt!</Text>
        </Box>
        <Box className="comment-wrapper">
          <Flex className="comment-user-name">
            <HStack>
              <Text fontSize="2rem" marginRight="0.5rem" fontWeight="bold">
                Bùi Đức Uy Dũng
              </Text>
              <BsFillCheckCircleFill fontSize="1.5rem" color="var(--chakra-colors-green-300)" />
              <Text fontSize="1.6rem" marginLeft="0.5rem" color="var(--chakra-colors-green-300)">
                Đã khám ngày 06/08/2021
              </Text>
            </HStack>
          </Flex>
          <Text fontSize="1.5rem">Dịch vụ tốt!</Text>
        </Box>
        <Box className="comment-wrapper">
          <Flex className="comment-user-name">
            <HStack>
              <Text fontSize="2rem" marginRight="0.5rem" fontWeight="bold">
                Bùi Đức Uy Dũng
              </Text>
              <BsFillCheckCircleFill fontSize="1.5rem" color="var(--chakra-colors-green-300)" />
              <Text fontSize="1.6rem" marginLeft="0.5rem" color="var(--chakra-colors-green-300)">
                Đã khám ngày 06/08/2021
              </Text>
            </HStack>
          </Flex>
          <Text fontSize="1.5rem">Dịch vụ tốt!</Text>
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
