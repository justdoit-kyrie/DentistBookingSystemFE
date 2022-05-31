import { Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

const TitleBlock = ({ title, desc, children, ...passProps }) => {
  const { value, color, fontWeight, fontSize } = title;
  const { value: descVal, color: descColor = 'desc.500', ...descProps } = desc;
  return (
    <Flex direction="column" gap="2rem" {...passProps}>
      <Heading fontSize={fontSize} fontWeight={fontWeight} color={color}>
        {value}
      </Heading>
      <Text color={descColor} {...descProps}>
        {descVal}
      </Text>
      {children}
    </Flex>
  );
};

export default TitleBlock;
