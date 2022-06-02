import { Circle, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';

const SelectedAdvanceDropdown = (item, props) => {
  if (item) {
    return (
      <Flex gap="1rem" fontSize="1.4rem" align="center" bg="primary.500" borderRadius="12px" p="0.5rem">
        <Circle w="3rem" h="3rem" overflow="hidden">
          <Image src="https://images.unsplash.com/photo-1653936803535-c471fd394f6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
        </Circle>
        {item.name ? (
          <Text fontWeight="500" color="white">
            {item.name}
          </Text>
        ) : (
          <Text fontWeight="500" color="white">{`${item.firstName} ${item.lastName}`}</Text>
        )}
      </Flex>
    );
  }

  return <span>{props.placeholder}</span>;
};

export default SelectedAdvanceDropdown;
