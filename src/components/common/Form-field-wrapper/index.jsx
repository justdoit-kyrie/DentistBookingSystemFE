import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

const FormFieldWrapper = ({ label, children }) => {
  return (
    <Flex direction="column" gap="0.5rem">
      <Text fontWeight="600" fontSize="1.3rem" textTransform="capitalize">
        {label}
      </Text>
      {children}
    </Flex>
  );
};

export default FormFieldWrapper;
