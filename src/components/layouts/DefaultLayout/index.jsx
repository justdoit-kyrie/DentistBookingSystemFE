import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { Carousel } from 'primereact/carousel';
import React, { useEffect, useRef } from 'react';
import BG1 from '~/assets/images/bg_1.jpg';
import BG2 from '~/assets/images/bg_2.jpg';
import Header from '~/components/common/Header';
import styles from './DefaultLayout.module.scss';
import './DefaultLayout.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  banners: [
    {
      background: BG1,
      content: {
        title: 'Modern Dentistry in a Calm and Relaxed Environment',
        desc: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.'
      }
    },
    {
      background: BG2,
      content: {
        title: 'Modern Achieve Your Desired Perfect Smile',
        desc: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.'
      }
    }
  ]
};

const effect = {
  initial: {
    y: 200,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const DefaultLayout = ({ children }) => {
  const { banners } = MOCK_DATA;
  const ref = useRef();

  const itemTemplate = ({ background, content }) => {
    const { title, desc } = content;
    return (
      <Box
        w="100%"
        h="75vh"
        background={`linear-gradient(rgba(0,0,0,0.27), rgba(0,0,0,0.27)), url('${background}') no-repeat center center`}
      >
        <Box className="container" position="relative" zIndex="3" top="50%" transform="translateY(-50%)">
          <Flex
            as={motion.div}
            variants={effect}
            initial="initial"
            animate="animate"
            maxW="45%"
            direction="column"
            gap="2rem"
            fontSize="2rem"
            color="white"
          >
            <Heading fontSize="4rem" fontWeight="500">
              {title}
            </Heading>
            <Text color="desc.500">{desc}</Text>
            <Button variant="primary-circle" fontSize="2rem" p="3rem 0" maxW="40%">
              Make a Appointment
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  };

  useEffect(() => {
    const handler = () => {
      const innerEle = ref.current;
      const scrollPos = window.pageYOffset;
      const innerHeight = innerEle.offsetHeight;

      if (scrollPos > innerHeight * 3) {
        if (!innerEle.classList.contains(cx('scrolled'))) {
          innerEle.classList.add(cx('scrolled'));
        }
      }
      if (scrollPos < innerHeight * 3) {
        if (innerEle.classList.contains(cx('scrolled'))) {
          innerEle.classList.remove(cx('scrolled'));
          innerEle.classList.remove(cx('sleep'));
        }
      }
      if (scrollPos > innerHeight * 6) {
        if (!innerEle.classList.contains(cx('awake'))) {
          innerEle.classList.add(cx('awake'));
        }
      }
      if (scrollPos < innerHeight * 6) {
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
    <Box className="wrapper" w="100vw" h="100vh">
      <Box position="relative">
        <Carousel value={banners} itemTemplate={itemTemplate} numVisible={1} numScroll={1} />
        <div ref={ref} className={cx('header-wrapper')}>
          <Box className="container">
            <Header />
          </Box>
        </div>
      </Box>
      <Box flex={1} pt="5rem" pb="10rem">
        {children}
      </Box>
    </Box>
  );
};

export default DefaultLayout;
