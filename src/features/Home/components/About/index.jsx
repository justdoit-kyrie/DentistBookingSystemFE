import { Box, Flex, Image, Square, useMediaQuery } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import React from 'react';
import { TitleBlock } from '..';
import styles from '../../Home.module.scss';

const cx = classNames.bind(styles);
const ABOUT_ROTATE = 45;

const About = ({ about, effect, children_effect }) => {
  const [isLargerThan1441] = useMediaQuery('(min-width: 1441px)');
  const [isLessThan767] = useMediaQuery('(max-width: 767px)');

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
    <Flex
      position="relative"
      zIndex="3"
      minH="75rem"
      maxH={isLargerThan1441 ? '75rem' : 'revert'}
      bg="linear-gradient(200deg, #2f89fc 0%, #2cbcbc 100%)"
      mt="7rem"
      id="about"
      direction={isLessThan767 ? 'column' : 'row'}
    >
      <Box flex={1}>
        <Image objectFit="cover" src={about.image} w="100%" h="100%" alt="image" />
      </Box>
      <Flex flex={1} align="center" p="5rem 0" overflow="hidden">
        <Box
          sx={{
            '@media screen and (max-width: 1439px)': {
              w: '90%'
            },
            '@media screen and (max-width: 1023px)': {
              pl: '7rem'
            },
            '@media screen and (max-width: 767px)': {
              pl: '3rem'
            }
          }}
          h="fit-content"
          w="80%"
          pl="10rem"
          as={motion.div}
          variants={effect}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <TitleBlock title={about.title} desc={about.desc} maxW="100%" />

          <Flex direction="column" gap="6rem" mt="5rem">
            {renderAboutList()}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default About;
