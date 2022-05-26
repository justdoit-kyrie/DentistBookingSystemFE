import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Header from '~/components/common/Header';

const DefaultLayout = ({ children }) => {
  return (
    <Flex w="100vw" h="100vh" direction="column">
      <Header />
      <Box flex={1}>{children}</Box>
    </Flex>
  );
};

export default DefaultLayout;
