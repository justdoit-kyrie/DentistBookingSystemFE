import { Flex } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

const Wrapper = ({ children, ...passProps }, ref) => {
  return (
    <Flex
      ref={ref}
      minW="15rem"
      maxH="20rem"
      boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      bg="white"
      direction="column"
      gap="0.5rem"
      overflow="auto"
      borderRadius="0.5rem"
      {...passProps}
    >
      {children}
    </Flex>
  );
};

export default forwardRef(Wrapper);
