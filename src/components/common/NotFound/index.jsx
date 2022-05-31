import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react';
import notFoundBG from '~/assets/images/notFound-bg.png';
import notFoundIcon from '~/assets/images/notFoundIcon.png';

const NotFound = () => {
  return (
    <Box h="100vh" w="100%">
      <Flex align="center" justify="center" h="100%" bg={`url(${notFoundBG}) no-repeat center center`} bgSize="cover">
        <Flex direction="column" gap="4rem" align="center" justify="center">
          <Flex align="center" gap="1.5rem" justify="center">
            <Text fontSize="30rem" lineHeight="19.5rem" fontWeight="900" color="black">
              4
            </Text>
            <Image boxSize="30%" src={notFoundIcon} alt="notfound icon" />
            <Text fontSize="30rem" lineHeight="19.5rem" fontWeight="900" color="black">
              4
            </Text>
          </Flex>
          <Text color="gray.400" fontSize="1.5rem" fontWeight="600" casing="-1">
            Couldn't find this page
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NotFound;
