import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

const DefaultLayout = ({ children }) => {
  return (
    <Flex w="100vw" h="100vh" direction="column">
      <Box w="100%">header</Box>
      <Flex flex={1}>
        <Box flex={1}>sidebar</Box>
        <Box flex={2}>{children}</Box>
      </Flex>
    </Flex>
  );
};

export default DefaultLayout;
