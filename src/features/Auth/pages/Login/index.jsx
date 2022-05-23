import { Box, Flex, Heading, Text, useColorMode, useMediaQuery } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { withTranslation } from 'react-i18next';
import FormLogin from '../../components/FormLogin';

const effect = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: {
    x: -1000,
    opacity: 0,
    transition: { duration: 0.25 }
  }
};

const Login = ({ t }) => {
  const [isLessThan1023] = useMediaQuery('(max-width: 1023px)');
  const { colorMode } = useColorMode();

  return (
    <Flex
      w="80%"
      h="100%"
      justify="space-evenly"
      direction="column"
      background="transparent"
      as={motion.div}
      variants={effect}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box maxW="80%" textAlign="center" margin="0 auto" mb={isLessThan1023 ? '' : '2rem'}>
        <Heading textTransform="capitalize">{t('auth.login.title', { logo: 'logo' })}</Heading>
        <Text color={colorMode === 'light' ? 'grey.500' : 'white.200'} mt="1rem" fontWeight={500} fontSize="1.2rem">
          {t('auth.login.description')}
        </Text>
      </Box>
      <FormLogin />
    </Flex>
  );
};

export default withTranslation()(Login);
