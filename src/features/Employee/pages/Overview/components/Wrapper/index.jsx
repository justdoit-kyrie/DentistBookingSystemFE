import { Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';

const Wrapper = ({ label, onViewAll = () => {}, children, link }) => {
  return (
    <Flex direction="column" gap="1.5rem" position="relative">
      <Flex justify="space-between" align="center">
        <Heading fontSize="1.6rem" lineHeight="1" textTransform="capitalize">
          {label}
        </Heading>
        {link && (
          <Flex
            onClick={onViewAll}
            align="center"
            justify="flex-start"
            color="primary.500"
            cursor="pointer"
            _hover={{ textDecor: 'underline' }}
            fontSize="1.2rem"
          >
            <Text textTransform="capitalize" lineHeight="1">
              {link}
            </Text>
            <BsChevronRight fontSize="1.4rem" />
          </Flex>
        )}
      </Flex>
      {children}
    </Flex>
  );
};

export default Wrapper;
