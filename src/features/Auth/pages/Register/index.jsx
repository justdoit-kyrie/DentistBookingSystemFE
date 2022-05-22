import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { withTranslation } from 'react-i18next';
import FormRegister from '../../components/FormRegister';

const effect = {
  initial: {
    x: 1000
  },
  animate: {
    x: 0,
    transition: { duration: 0.5 }
  },
  exit: {
    x: 1000,
    transition: { duration: 0.5 }
  }
};

const Register = ({ t }) => {
  return (
    <Flex
      w="80%"
      h="60vh"
      justify="space-evenly"
      direction="column"
      background="transparent"
      as={motion.div}
      variants={effect}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box maxW="80%" textAlign="center" margin="0 auto 2rem">
        <Heading textTransform="capitalize">{t('auth.register.title', { logo: 'logo' })}</Heading>
        <Text color="grey.500" mt="1rem" fontWeight={700} fontSize="1.2rem">
          {t('auth.register.description')}
        </Text>
      </Box>
      <FormRegister />
    </Flex>
  );
};

export default withTranslation()(Register);
