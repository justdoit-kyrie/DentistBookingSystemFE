import { Flex } from '@chakra-ui/react';
import React from 'react';
import { MutatingDots } from 'react-loader-spinner';
import { COLORS } from '~/app/constants';

const Loading = ({ position = 'fixed' }) => {
  return (
    <Flex
      justify="center"
      align="center"
      bg={COLORS.black[100]}
      position={position}
      inset="0"
      w="100%"
      h="100%"
      zIndex="999"
      borderRadius="inherit"
    >
      <MutatingDots ariaLabel="loading-indicator" />
    </Flex>
  );
};

export default Loading;
