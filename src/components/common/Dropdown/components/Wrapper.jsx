import { Box, Flex, Text } from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { FiChevronLeft } from 'react-icons/fi';

const Wrapper = ({ label, children, onBack, ...passProps }, ref) => {
  return (
    <Flex
      py="0.75rem"
      ref={ref}
      minW="20rem"
      maxH="20rem"
      boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      direction="column"
      gap="0.5rem"
      overflow="auto"
      borderRadius="0.5rem"
      zIndex="999"
      bg="white"
      {...passProps}
    >
      {label && (
        <Box
          mt="-0.75rem"
          px="1rem"
          py="1.25rem"
          cursor="pointer"
          fontSize="1.5rem"
          onClick={onBack}
          position="relative"
          color="black"
        >
          <FiChevronLeft fontSize="2rem" />
          <Text fontWeight="700" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
            {label}
          </Text>
        </Box>
      )}
      {children}
    </Flex>
  );
};

export default forwardRef(Wrapper);
