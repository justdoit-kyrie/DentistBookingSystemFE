import { Avatar, Box, Flex, Heading, Text } from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '~/features/Auth/authSlice';

const ProfileTemplate = ({ gap = '1rem', titleColor, flex, icon, user }, ref) => {
  const { lastName, firstName, email, imageUrl } = user ? user : useSelector(selectLoggedUser) || {};

  let IconComp;
  if (icon) IconComp = icon;

  return (
    <Flex ref={ref} gap={gap} flex={flex} align="center">
      <Avatar size="lg" name={`${lastName} ${firstName}`} src={imageUrl} />
      {/* <Circle size="4rem" overflow="hidden">
        <Image h="100%" w="100%" src={imageUrl ? imageUrl : DEFAULT_AVATAR} alt="avatar" objectFit="cover" />
      </Circle> */}
      <Box>
        <Heading fontSize="1.5rem" color={titleColor}>{`${lastName} ${firstName}`}</Heading>
        <Text fontSize="1.2rem" color="grey.300" mt="0.5rem">
          {email}
        </Text>
      </Box>
      {IconComp && <IconComp fontSize="1.5rem" />}
    </Flex>
  );
};

export default forwardRef(ProfileTemplate);
