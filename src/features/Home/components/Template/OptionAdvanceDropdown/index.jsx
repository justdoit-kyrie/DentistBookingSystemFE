import { Circle, Flex, Image, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { USER_POSITION } from '~/app/constants';

const OptionAdvanceDropdown = (item) => {
  const { colorMode } = useColorMode();
  return (
    <Flex gap="1rem" fontSize="1.6rem" align="center" ml="1rem">
      <Circle w="3rem" h="3rem" overflow="hidden">
        <Image src="https://images.unsplash.com/photo-1653936803535-c471fd394f6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60" />
      </Circle>

      <Flex direction="column" color={colorMode === 'light' ? 'black' : 'white'}>
        {item.name ? (
          <Text fontWeight="700">{item.name}</Text>
        ) : (
          <Text fontWeight="700">{`${item.firstName} ${item.lastName}`}</Text>
        )}
        <Text textTransform="uppercase">{USER_POSITION[item.position]}</Text>
      </Flex>
    </Flex>
  );
};

export default OptionAdvanceDropdown;
