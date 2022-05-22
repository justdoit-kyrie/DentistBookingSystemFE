import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames/bind';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { useForm } from 'react-hook-form';
import { BsCircle, BsCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { PWD_REGEX } from '~/app/constants';
import { InputField } from '~/components';
import styles from './FormRegister.module.scss';
import { AiOutlineGoogle } from 'react-icons/ai';
import { withTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const cx = classnames.bind(styles);
// initial validation rules
const schema = yup
  .object({
    email: yup.string().required('email is required').email('email is not correct format'),
    password: yup
      .string()
      .required('password is required')
      .min(12, 'password is longer than 12 characters')
      .matches(
        PWD_REGEX,
        'password is at least one uppercase letter, one lowercase letter, one number and one special character'
      )
  })
  .required();

// initial values
const defaultValues = {
  email: '',
  password: ''
};

const FormRegister = ({ t }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => console.log(data);

  const handleResponseGoogle = (response) => {
    console.log({ response });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="2rem">
        <InputField
          errors={errors}
          control={control}
          name="email"
          placeholder={t('auth.login.emailPlaceholder')}
          rightIcon={BsCircle}
          rightIconActive={BsCircleFill}
        />
        <InputField
          errors={errors}
          control={control}
          name="password"
          placeholder={t('auth.login.pwdPlaceholder')}
          type="password"
        />

        <Link to="/trouble" style={{ width: 'fit-content' }}>
          <Text color="black" fontWeight="700" mt="-0.5rem" w="fit-content">
            {t('auth.login.subTitle.1')}
          </Text>
        </Link>

        <Button
          as={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          size="full"
          variant="primary"
          textTransform="capitalize"
          color="black"
          borderRadius="1rem"
        >
          {t('auth.register.submit')}
        </Button>
        <Box>
          <Text className={cx('line')}>{t('auth.login.subTitle.2')}</Text>
        </Box>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          render={(renderProps) => (
            // disabled={renderProps.disabled}
            <Button size="lg" h="auto" variant="outline" onClick={renderProps.onClick} leftIcon={<AiOutlineGoogle />}>
              Google
            </Button>
          )}
          onSuccess={handleResponseGoogle}
          onFailure={handleResponseGoogle}
          cookiePolicy={'single_host_origin'}
        />
        <Flex justify="center" align="center">
          <Text mr="0.25rem">{t('auth.login.subTitle.3')}</Text>
          <Link to="/register">
            <Text fontWeight={900} textTransform="capitalize" _hover={{ textDecor: 'underline' }}>
              {t('auth.register.subTitle.4')}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </form>
  );
};

export default withTranslation()(FormRegister);
