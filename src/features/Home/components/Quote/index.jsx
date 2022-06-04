import { Box, Flex, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { FormQuote } from '..';

const MOCK_DATA = (t) => ({
  title: t('home.quote.title'),
  desc: t('home.quote.desc'),
  list: [t('home.quote.list.0'), t('home.quote.list.1'), t('home.quote.list.2')]
});

const Quote = ({ t, effect }) => {
  const { title, desc, list } = MOCK_DATA(t);

  // eslint-disable-next-line no-unused-vars
  const [isLessThan1279] = useMediaQuery('(max-width: 1279px)');
  const [isLessThan1023] = useMediaQuery('(max-width: 1023px)');
  const [isLessThan767] = useMediaQuery('(max-width: 767px)');

  return (
    <Flex position="relative" minH="596px" mt="7rem">
      <Box
        bg="primary.500"
        h={isLessThan1023 ? '50%' : '100%'}
        w={isLessThan1023 ? '100%' : '50%'}
        position="absolute"
        top="0"
        left="0"
        zIndex="-1"
      ></Box>

      <Flex className="container" flex={1} direction={isLessThan1023 ? 'column' : 'row'}>
        <Flex flex={1} justify={isLessThan1023 ? 'flex-start' : 'flex-end'} h="100%">
          <Flex
            sx={{
              '@media screen and (max-width: 1279px)': {
                maxW: '80%'
              },
              '@media screen and (max-width: 767px)': {
                maxW: '100%'
              }
            }}
            as={motion.div}
            variants={effect}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            maxW="60%"
            h="100%"
            pt="5rem"
            pb="2rem"
            px={isLessThan767 ? '0' : '3rem'}
            direction="column"
            bg="transparent"
            fontSize="1.75rem"
            color="white"
            gap="5rem"
          >
            <Heading fontSize="3rem" fontWeight="400">
              {title}
            </Heading>
            <Text color="desc.500">{desc}</Text>
            <Flex direction="column" color="desc.500" gap="1.5rem">
              {list.map((val, index) => (
                <Flex key={`${index}`} gap="1rem" align="center">
                  <FaCheck color="white" />
                  <Text>{val}</Text>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>
        <Flex flex={1} justify="flex-start" align="center">
          <Box
            sx={{
              '@media screen and (max-width: 1023px)': {
                px: '3rem'
              },
              '@media screen and (max-width: 767px)': {
                px: 0
              }
            }}
            as={motion.div}
            variants={effect}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            maxH={isLessThan1023 ? '100%' : '85%'}
            w="100%"
            h="100%"
            px="5rem"
          >
            <Heading fontSize="3rem" fontWeight="400" color="primary.500" pt={isLessThan1023 ? '5rem' : '0'}>
              {t('home.quote.form.title')}
            </Heading>
            <FormQuote maxW={isLessThan1023 ? '100%' : '70%'} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default withTranslation()(Quote);
