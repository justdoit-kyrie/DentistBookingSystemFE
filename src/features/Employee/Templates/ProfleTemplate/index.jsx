import { Box, Circle, Flex, Heading, Image, Text } from '@chakra-ui/react';
import React, { forwardRef } from 'react';

const ProfileTemplate = (
  {
    img = 'https://images.unsplash.com/photo-1654423625700-454987d4b73c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
    title = { value: 'Stephen Conley', fontSize: '1.5rem' },
    desc = { value: 'Stephen Conley', fontSize: '1.2rem', color: 'grey.300', mt: '0.5rem' },
    gap = '1rem',
    flex,
    icon
  },
  ref
) => {
  const { value: titleVal, ...titleProps } = title;
  const { value: descVal, ...descProps } = desc;

  let IconComp;
  if (icon) IconComp = icon;

  return (
    <Flex ref={ref} gap={gap} flex={flex} align="center">
      <Circle size="4rem" overflow="hidden">
        <Image h="100%" src={img} />
      </Circle>
      <Box>
        <Heading {...titleProps}>{titleVal}</Heading>
        <Text {...descProps}>{descVal}</Text>
      </Box>
      {IconComp && <IconComp fontSize="1.5rem" />}
    </Flex>
  );
};

export default forwardRef(ProfileTemplate);
