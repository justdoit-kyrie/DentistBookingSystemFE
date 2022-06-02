/* eslint-disable no-unused-vars */
import { Box, Circle, Flex, Heading, Image, Square, Text } from '@chakra-ui/react';
import classnames from 'classnames/bind';
import { motion } from 'framer-motion';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { axios } from '~/apis';
import { API_ROUTES, USER_POSITION } from '~/app/constants';
import ABOUT_BG_2 from '~/assets/images/about_2.jpg';
import FEATURE_BG_1 from '~/assets/images/feature_1.png';
import FEATURE_BG_2 from '~/assets/images/feature_2.png';
import FEATURE_BG_3 from '~/assets/images/feature_3.png';
import FEATURE_BG_4 from '~/assets/images/feature_4.png';
import { CustomCarousel } from '~/components';
import { Dentist, TitleBlock } from './components';
import FeatureBlock from './components/FeatureBlock';
import { OptionAdvanceDropdown, SelectedAdvanceDropdown } from './components/Template';
import { BsTwitter } from 'react-icons/bs';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

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
  },
  clinic: {
    title: { value: 'Meet Our Experience Dentist', fontSize: '3rem', color: 'primary.200', fontWeight: 400 },
    desc: {
      value:
        'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences',
      color: 'grey'
    },
    list: [
      {
        name: 'duc iu linh',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      },
      {
        name: 'name',
        image:
          'https://images.unsplash.com/photo-1654004762137-0e4025b88119?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60'
      }
    ]
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
  const { title, desc, category, about, dentist, clinic } = MOCK_DATA;
  const [selectedClinic, setSelectedClinic] = useState();
  const [selectedDentist, setSelectedDentist] = useState();
  const [dentists, setDentists] = useState([]);
  const navigate = useNavigate();

  const renderHeader = ({ ...passProps }) => {
    return (
      <Box
        className="carousel-header"
        mb="1rem"
        py="1rem"
        borderTop="1px solid #dee2e6"
        borderBottom="1px solid #dee2e6"
        bg="#f8f9fa"
      >
        <Dropdown valueTemplate={SelectedAdvanceDropdown} itemTemplate={OptionAdvanceDropdown} {...passProps} />
      </Box>
    );
  };

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

  const renderClinicList = (clinic) => {
    return (
      <Flex w="100%" direction="column" align="flex-start" gap="1rem" cursor="pointer" className={cx('clinic-item')}>
        <Image src={clinic.image} />
        <Text fontSize="1.6rem">{clinic.name}</Text>
      </Flex>
    );
  };

  const renderDentistList = (item) => (
    <Box className={cx('dentist-item')}>
      <Flex
        borderRadius="12px"
        w="100%"
        align="center"
        direction="column"
        justify="center"
        p="2rem 2rem 3rem"
        border="1px solid grey"
      >
        <Circle size="15rem" overflow="hidden">
          <Image src={item.avatar} alt="avatar" />
        </Circle>
        <Flex
          direction="column"
          justify="center"
          align="center"
          fontSize="1.8rem"
          textTransform="capitalize"
          m="2rem 0 2.5rem"
        >
          <Heading fontWeight="500">{`${item.firstName} ${item.lastName}`}</Heading>
          <Text fontSize="1.4rem" color="primary.500" mt="1rem">
            {USER_POSITION[item.position]}
          </Text>
        </Flex>
        <Text mb="3rem" lineHeight="1.6" fontSize="1.4rem" textAlign="center" color="grey">
          {item.description}
        </Text>
        <Flex justify="space-evenly" color="primary.500" w="100%" maxW="60%" fontSize="1.6rem">
          <Link to="#" target="_blank">
            <BsTwitter color="inherit" />
          </Link>
          <Link to="#" target="_blank">
            <FaFacebookF color="inherit" />
          </Link>
          <Link to="#" target="_blank">
            <FaInstagram color="inherit" />
          </Link>
          <Link to="#" target="_blank">
            <FaTiktok color="inherit" />
          </Link>
        </Flex>
      </Flex>
    </Box>
  );

  useEffect(() => {
    let route = '';
    if (selectedClinic) {
      route = `/clinic/${selectedClinic.id}`;
    }

    if (selectedDentist) {
      route = `/dentist/${selectedDentist.id}`;
    }
    return navigate(route);
  }, [selectedClinic, selectedDentist]);

  useEffect(() => {
    (async () => {
      const { content } = await axios.get(API_ROUTES['get-dentists']);
      if (content?.length > 0) setDentists(content);
    })();
  }, []);

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
      <FeatureBlock header={dentist} effect={effect}>
        {dentists && (
          <CustomCarousel
            header={renderHeader({
              value: selectedDentist,
              options: dentists,
              optionLabel: 'selectedDentist',
              onChange: (e) => setSelectedDentist(e.value),
              filter: true,
              showClear: true,
              filterBy: 'firstName, lastName',
              placeholder: 'Enter a dentist name'
            })}
            callback={renderDentistList}
            circular
            value={dentists}
            numVisible={3}
            numScroll={1}
            contentClassName="no-indicators custom-action square"
          />
        )}
      </FeatureBlock>

      {/* clinic */}
      <FeatureBlock header={dentist} effect={effect}>
        <CustomCarousel
          header={renderHeader({
            value: selectedClinic,
            options: clinic.list,
            optionLabel: 'selectedClinic',
            onChange: (e) => setSelectedClinic(e.value),
            filter: true,
            showClear: true,
            filterBy: 'name',
            placeholder: 'Enter a clinic name'
          })}
          callback={renderClinicList}
          circular
          value={clinic.list}
          numVisible={3}
          numScroll={1}
          contentClassName="no-indicators custom-action square"
        />
      </FeatureBlock>
    </>
  );
};

export default HomePage;
