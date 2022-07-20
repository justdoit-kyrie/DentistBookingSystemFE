import { Box, Button, Flex, Heading, Text, useColorMode, useMediaQuery } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import BG1 from '~/assets/images/bg_1.jpg';
import BG2 from '~/assets/images/bg_2.jpg';
import { CustomCarousel } from '~/components/common';
import Header from '~/components/common/Header';
import styles from './DefaultLayout.module.scss';
import './DefaultLayout.scss';

const cx = classNames.bind(styles);

const MOCK_DATA = {
  banners: [
    {
      background: BG1,
      t_key: 0
    },
    {
      background: BG2,
      t_key: 1
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

const DefaultLayout = ({ t, children }) => {
  const { banners } = MOCK_DATA;

  const [isLessThan767] = useMediaQuery('(max-width: 767px)');
  const ref = useRef();
  const { colorMode } = useColorMode();

  const itemTemplate = ({ background, t_key }) => {
    return (
      <Box
        w="100%"
        h="75vh"
        background={`linear-gradient(rgba(0,0,0,0.27), rgba(0,0,0,0.27)), url('${background}') no-repeat center center`}
        backgroundSize="cover"
      >
        <Box className="container" position="relative" zIndex="3" top="50%" transform="translateY(-50%)">
          <Flex
            as={motion.div}
            variants={effect}
            initial="initial"
            animate="animate"
            maxW={isLessThan767 ? '70%' : '45%'}
            direction="column"
            gap="2rem"
            fontSize={isLessThan767 ? '1.4rem' : '2rem'}
            color="white"
          >
            <Heading
              sx={{
                '@media screen and (max-width: 1023px)': {
                  fontSize: '3.2rem'
                },
                '@media screen and (max-width: 767px)': {
                  fontSize: '2rem'
                }
              }}
              fontSize="4rem"
              variant="medium"
            >
              {t(`home.header.banners.content.${t_key}.title`)}
            </Heading>
            <Text color="desc.500">{t(`home.header.banners.content.${t_key}.desc`)}</Text>
            <Button
              sx={{
                '@media screen and (max-width: 1279px)': {
                  maxW: '60%'
                },
                '@media screen and (max-width: 1023px)': {
                  maxW: '80%'
                },
                '@media screen and (max-width: 767px)': {
                  fontSize: '1.6rem'
                }
              }}
              variant="primary-circle"
              fontSize="2rem"
              p="3rem 0"
              maxW="40%"
              _hover={{
                bg: 'transparent',
                borderColor: 'primary.500',
                color: 'primary.500'
              }}
              onClick={() => {
                window.scrollTo(0, 1930);
              }}
            >
              {t('home.header.banners.action')}
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
        <CustomCarousel
          responsiveOptions={[]}
          autoplayInterval="2000"
          value={banners}
          callback={itemTemplate}
          numVisible={1}
          numScroll={1}
          containerClassName="no-action"
        />
        <div ref={ref} className={cx('header-wrapper', colorMode === 'light' ? '' : 'dark')}>
          <Box className="container">
            <Header />
          </Box>
        </div>
      </Box>
      <Box flex={1}>{children}</Box>
    </Box>
  );
};

export default withTranslation()(DefaultLayout);
