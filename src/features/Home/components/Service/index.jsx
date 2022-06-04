import { Box, Button, Flex, Text, useColorMode } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import React from 'react';
import { CustomCarousel } from '~/components';
import { FeatureBlock } from '..';
import styles from '../../Home.module.scss';

const cx = classNames.bind(styles);

const Service = ({ service, effect }) => {
  const { colorMode } = useColorMode();

  const renderServiceList = ({ name, price }) => {
    return (
      <Box className={cx('carousel-p-1')} pb="5rem">
        <Box
          className={cx('service-item')}
          border="1px solid"
          borderColor="grey.50"
          pt="1rem"
          pb="5rem"
          position="relative"
        >
          <Text fontSize="1.75rem" textTransform="capitalize" textAlign="center">
            {name}
          </Text>
          <Box my="2rem" textAlign="center" fontSize="1.25rem">
            <Text as="span" fontSize="3rem" color="primary.500" fontWeight="600">
              {`$${price}`}
            </Text>
            <Text as="span" fontStyle="italic">
              / session
            </Text>
          </Box>
          <Flex
            className={colorMode === 'light' ? cx('service-item-procedure') : cx('service-item-procedure', 'dark')}
            direction="column"
            justify="flex-start"
            textAlign="center"
            fontSize="1.5rem"
            textTransform="capitalize"
            color={colorMode === 'light' ? 'grey.70' : 'white'}
          >
            <Text>iagnostic Services</Text>
            <Text>iagnostic Services</Text>
            <Text>iagnostic Services</Text>
            <Text>iagnostic Services</Text>
            <Text>iagnostic Services</Text>
          </Flex>

          <Button
            className={cx('service-item-action')}
            variant="primary-circle"
            w="45%"
            h="6rem"
            fontSize="1.75rem"
            color="white"
            bg="primary.500"
            position="absolute"
            top="100%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex="999"
          >
            order now
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <FeatureBlock id="service" header={service} effect={effect}>
      <CustomCarousel
        callback={renderServiceList}
        circular
        value={service.list}
        numVisible={4}
        numScroll={1}
        contentClassName="no-indicators custom-action square"
      />
    </FeatureBlock>
  );
};

export default Service;
