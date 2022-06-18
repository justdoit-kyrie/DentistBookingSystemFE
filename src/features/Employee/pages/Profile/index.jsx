import { Box, Flex, Heading } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import FormUpdate from './components/FormUpdate';

// initial values
const defaultValues = {
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dob: '',
  gender: ''
};

const ProfilePage = () => {
  const userInfo = useSelector(selectLoggedUser);
  const initialValue = userInfo
    ? {
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        phoneNumber: userInfo.phone,
        dob: moment(userInfo.dob).toDate(),
        gender: `${userInfo.gender}`
      }
    : defaultValues;
  return (
    <>
      <Heading color="primary.500" textTransform="capitalize">
        Profile
      </Heading>

      <Box h="100%" border="3px solid" borderColor="grey.100" borderRadius="2rem" mt="3rem">
        <Flex align="flex-start" p="5rem 0 0 10rem" h="100%" w="80%" gap="10rem">
          {userInfo && <FormUpdate initialValue={initialValue} />}
        </Flex>
      </Box>
    </>
  );
};

export default ProfilePage;
