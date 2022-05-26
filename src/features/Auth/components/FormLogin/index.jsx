import { Box, Button, Flex, Text, useColorMode } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames/bind';
import { signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { AiOutlineUser } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axios } from '~/apis';
import { API_ROUTES, ORTHERS_LOGIN_METHOD, PWD_REGEX } from '~/app/constants';
import { Firebase } from '~/app/firebase';
import { InputField } from '~/components';
import { setLocalStorage } from '~/utils';
import { init, loginFailed, loginSuccess } from '../../authSlice';
import styles from './FormLogin.module.scss';

const cx = classnames.bind(styles);
// initial validation rules
const schema = yup
  .object({
    userName: yup.string().required('userName is required'),
    password: yup
      .string()
      .required('password is required')
      .min(12, 'password is longer than 12 characters')
      .matches(
        PWD_REGEX,
        'password is at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    displayName: yup.string()
  })
  .required();

// initial values
const defaultValues = {
  userName: '',
  password: '',
  rememberMe: true,
  displayName: ''
};

const FormLogin = ({ t }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const [isWithoutDisplayName, setIsWithoutDisplayName] = useState(false);

  //init firebase
  const firebase = new Firebase();
  const auth = firebase.getAuth();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      dispatch(init());
      if (isWithoutDisplayName) {
        return;
      }
      const res = await axios.post(`${API_ROUTES.login}`, data);
      if (res.code) {
        const { message } = res;
        dispatch(loginFailed());
        toast.error(message);
      } else {
        const { accessToken, refreshToken, ...others } = res;
        dispatch(loginSuccess({ ...others }));
        setLocalStorage('auth', { accessToken, refreshToken });
        return navigate('/');
      }
      console.log({ res });
    } catch (error) {
      dispatch(loginFailed());
    }
  };

  const handleOthersLogin = async (provider) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      const { accessToken, refreshToken, displayName, email, photoURL, uid } = user;
      const [firstName, ...rest] = displayName.split(' ');
      const lastName = rest.join(' ');

      // handle case not have displayName
      if (!displayName) {
        setIsWithoutDisplayName(true);
        return;
      }

      dispatch(loginSuccess({ firstName, lastName, email, photoURL, uid }));
      setLocalStorage('auth', { accessToken, refreshToken });
      return navigate('/');
    } catch (error) {
      console.log({ error });
    }
  };

  const renderLoginMethods = (data) => {
    return data.map(({ value, icon, provider }, index) => {
      const Icon = icon.value;
      if (icon.color)
        return (
          <Button
            key={index}
            size="lg"
            h="auto"
            variant="outline"
            leftIcon={<Icon fontSize="1.5rem" color={icon.color} />}
            onClick={() => handleOthersLogin(provider)}
          >
            {value}
          </Button>
        );
      return (
        <Button
          key={index}
          size="lg"
          h="auto"
          variant="outline"
          leftIcon={<Icon fontSize="1.5rem" color={colorMode === 'light' ? icon.lightColor : icon.darkColor} />}
          onClick={() => handleOthersLogin(provider)}
        >
          {value}
        </Button>
      );
    });
  };

  if (isWithoutDisplayName)
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="2rem">
          <InputField
            errors={errors}
            control={control}
            name="userName"
            placeholder={t('auth.login.emailPlaceholder')}
            rightIcon={AiOutlineUser}
            rightIconActive={FaUser}
          />

          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            size="full"
            variant="primary"
            textTransform="capitalize"
            borderRadius="1rem"
          >
            {t('auth.login.submit')}
          </Button>
        </Flex>
      </form>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" gap="2rem">
        <InputField
          errors={errors}
          control={control}
          name="userName"
          placeholder={t('auth.login.emailPlaceholder')}
          rightIcon={AiOutlineUser}
          rightIconActive={FaUser}
        />
        <InputField
          errors={errors}
          control={control}
          name="password"
          placeholder={t('auth.login.pwdPlaceholder')}
          type="password"
        />

        <Link to="/trouble" style={{ width: 'fit-content' }}>
          <Text fontWeight="700" mt="-0.5rem" w="fit-content" _hover={{ textDecor: 'underline' }}>
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
          borderRadius="1rem"
        >
          {t('auth.login.submit')}
        </Button>
        <Box>
          <Text className={cx('line')}>{t('auth.login.subTitle.2')}</Text>
        </Box>

        <Flex justify="space-evenly">{renderLoginMethods(ORTHERS_LOGIN_METHOD)}</Flex>

        <Flex justify="center" align="center">
          <Text mr="0.25rem">{t('auth.login.subTitle.3')}</Text>
          <Link to="/register">
            <Text fontWeight={900} textTransform="capitalize" _hover={{ textDecor: 'underline' }}>
              {t('auth.login.subTitle.4')}
            </Text>
          </Link>
        </Flex>
      </Flex>
    </form>
  );
};

export default withTranslation()(FormLogin);
