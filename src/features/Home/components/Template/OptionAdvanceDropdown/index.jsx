import { Circle, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';

const OptionAdvanceDropdown = (item) => {
  return (
    <Flex gap="1rem" fontSize="1.6rem" align="center">
      <Circle w="3rem" h="3rem" overflow="hidden">
        <Image src="https://images.unsplash.com/photo-1653936803535-c471fd394f6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
      </Circle>
      {item.name ? (
        <Text fontWeight="400">{item.name}</Text>
      ) : (
        <Text fontWeight="400">{`${item.firstName} ${item.lastName}`}</Text>
      )}
    </Flex>
  );
};

export default OptionAdvanceDropdown;
