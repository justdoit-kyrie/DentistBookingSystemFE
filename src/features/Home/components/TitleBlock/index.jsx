import { Flex, Heading, Text } from '@chakra-ui/react';
import React from 'react';

const TitleBlock = ({ title, desc, children, maxW, ...passProps }) => {
  const { value, color, fontWeight, fontSize } = title;
  const { value: descVal, color: descColor = 'desc.500', ...descProps } = desc;
  return (
    <Flex
      sx={{
        '@media screen and (max-width: 1023px)': {
          maxW: maxW ? maxW : '80%'
        },
        '@media screen and (max-width: 767px)': {
          maxW: maxW ? maxW : '100%'
        }
      }}
      direction="column"
      gap="2rem"
      maxW={maxW ? maxW : '50%'}
      {...passProps}
    >
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
