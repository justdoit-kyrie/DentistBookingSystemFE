import { Box, Flex, Heading, Image, Square, Text } from '@chakra-ui/react';
import classnames from 'classnames/bind';
import { motion } from 'framer-motion';
import React from 'react';
import { FaCheck } from 'react-icons/fa';
import ABOUT_BG_2 from '~/assets/images/about_2.jpg';
import FEATURE_BG_1 from '~/assets/images/feature_1.png';
import FEATURE_BG_2 from '~/assets/images/feature_2.png';
import FEATURE_BG_3 from '~/assets/images/feature_3.png';
import FEATURE_BG_4 from '~/assets/images/feature_4.png';
import { Dentist, TitleBlock } from './components';
import styles from './Home.module.scss';

const cx = classnames.bind(styles);

const MOCK_DATA = {
  title: { value: 'Our Service Keeps you Smile', fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
  desc: {
    value: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
    color: 'grey'
  },
  category: [
    {
      img: FEATURE_BG_1,
      title: 'Teeth Whitening',
      desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic.'
    },
    {
      img: FEATURE_BG_2,
      title: 'Teeth Cleaning',
      desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic.'
    },
    {
      img: FEATURE_BG_3,
      title: 'Quality Brackets',
      desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic.'
    },
    {
      img: FEATURE_BG_4,
      title: 'Modern Anesthetic',
      desc: 'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic.'
    }
  ],
  about: {
    title: { value: 'Dentacare with a personal touch', fontSize: '3rem', color: 'white', fontWeight: 400 },
    desc: {
      value: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.',
      color: 'white',
      fontSize: '1.5rem'
    },
    image: ABOUT_BG_2,
    list: [
      {
        icon: FaCheck,
        title: { value: 'Well Experience Dentist', fontSize: '2rem', color: 'white', fontWeight: 400 },
        desc: {
          value:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
          fontSize: '1.5rem',
          opacity: 0.8
        }
      },
      {
        icon: FaCheck,
        title: { value: 'Well Experience Dentist', fontSize: '2rem', color: 'white', fontWeight: 400 },
        desc: {
          value:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
          fontSize: '1.5rem',
          opacity: 0.8
        }
      },
      {
        icon: FaCheck,
        title: { value: 'Well Experience Dentist', fontSize: '2rem', color: 'white', fontWeight: 400 },
        desc: {
          value:
            'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.',
          fontSize: '1.5rem',
          opacity: 0.8
        }
      }
    ]
  },
  dentist: {
    title: { value: 'Meet Our Experience Dentist', fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
    desc: {
      value:
        'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences',
      color: 'grey'
    }
  }
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
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const children_effect = {
  initial: {
    y: 100,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.3 }
  }
};

const ABOUT_ROTATE = 45;

const HomePage = () => {
  const { title, desc, category, about, dentist } = MOCK_DATA;

  const renderAboutList = () =>
    about.list.map((item, idx) => {
      const Icon = item.icon;
      return (
        <Flex as={motion.div} variants={children_effect} key={`${idx}`} gap="4rem" align="center">
          <Box position="relative">
            <Square
              as={motion.div}
              initial={{ rotate: ABOUT_ROTATE }}
              whileHover={{ rotate: 360 - ABOUT_ROTATE, transition: { type: 'spring', duration: 1.5 } }}
              border="0.5px solid white"
              size="6rem"
            ></Square>
            <Icon fontSize="2rem" color="white" className={cx('about-icon')} />
          </Box>
          <TitleBlock title={item.title} desc={item.desc} />
        </Flex>
      );
    });

  return (
    <>
      {/* features */}
      <Box
        className="container"
        as={motion.div}
        variants={effect}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <TitleBlock title={title} desc={desc} fontSize="1.5rem" maxW="50%" m="0 auto" textAlign="center" />
        <Flex gap="2rem" mt="5rem">
          {category.map(({ img, title, desc }, index) => (
            <Flex
              as={motion.div}
              variants={children_effect}
              key={`${index}`}
              flex="1"
              direction="column"
              gap="1.5rem"
              justify="center"
              align="center"
              fontSize="1.6rem"
              p="2rem"
            >
              <Flex
                justify="center"
                align="center"
                p="2rem"
                bg="#f8fbff"
                borderRadius="100rem"
                w="10rem"
                h="10rem"
                mb="1rem"
              >
                <Image w="85%" h="85%" src={img} alt="image" />
              </Flex>
              <Heading fontWeight="400" fontSize="2.5rem">
                {title}
              </Heading>
              <Text color="grey" textAlign="center">
                {desc}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* about */}
      {about && (
        <Flex
          position="relative"
          zIndex="3"
          maxH="68.4rem"
          bg="linear-gradient(200deg, #2f89fc 0%, #2cbcbc 100%);"
          mt="7rem"
        >
          <Box flex={1}>
            <Image src={about.image} w="100%" h="100%" alt="image" />
          </Box>
          <Flex flex={1} align="center">
            <Box
              h="80%"
              w="80%"
              pl="10rem"
              as={motion.div}
              variants={effect}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <TitleBlock title={about.title} desc={about.desc} />

              <Flex direction="column" gap="6rem" mt="5rem">
                {renderAboutList()}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      )}

      {/* dentist */}
      <Dentist dentist={dentist} />
    </>
  );
};

export default HomePage;
