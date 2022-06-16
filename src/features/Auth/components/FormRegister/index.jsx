/* eslint-disable no-unused-vars */
import {
  // Box,
  Button,
  Flex,
  Grid,
  Text,
  InputGroup,
  InputRightElement,
  RadioGroup,
  Radio
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames/bind';
import React, { useState } from 'react';
// import GoogleLogin from 'react-google-login';
import { Controller, useForm } from 'react-hook-form';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import {
  API_ROUTES,
  PWD_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  USER_REGEX,
  NAME_REGEX,
  DATE_FORMAT,
  API_CODE,
  PATH
} from '~/app/constants';
import { InputField, CalendarField } from '~/components';
// import { AiOutlineGoogle } from 'react-icons/ai';
import { withTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './FormRegister.scss';
import { axios } from '~/apis';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { init, loginFailed, registerSuccess } from '../../authSlice';

// initial validation rules
const schema = yup
  .object({
    gender: yup.string().required('required'),
    username: yup
      .string()
      .required('User name is required')
      .min(5, 'User name must have at least 5 characters')
      .max(30, 'User name must have less than 30 characters')
      .matches(USER_REGEX, 'Please enter a valid user name'),
    password: yup
      .string()
      .required('Password is required')
      .min(12, 'Password is longer than 12 characters')
      .matches(
        PWD_REGEX,
        'Password is at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
    email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .matches(PHONE_REGEX, 'Please enter a valid phone number'),
    firstName: yup.string().required('First name is required').matches(NAME_REGEX, 'Please enter a valid first name'),
    lastName: yup.string().required('Last name is required').matches(NAME_REGEX, 'Please enter a valid last name'),
    dob: yup.string().required('Please select date of birth')
  })
  .required();

// initial values
const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dob: '',
  gender: 0
};

// Render years

const FormRegister = ({ t }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    dispatch(init());
    try {
      const { code, message } = await axios.post(`${API_ROUTES.register}`, {
        ...data,
        gender: +data.gender,
        dob: moment(data.dob).format(DATE_FORMAT['yyyy-MM-DD'])
      });
      if (+code === API_CODE.OK) {
        dispatch(registerSuccess({ userName: data.username, password: data.password }));
        return navigate(PATH.login);
      } else {
        dispatch(loginFailed());
      }
    } catch (error) {
      // show toast
      dispatch(loginFailed());
    }
  };

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ position: '' }}>
      <Flex direction="column" gap="2rem">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <InputField
            errors={errors}
            control={control}
            name="firstName"
            placeholder={t('auth.register.firstNamePlaceholder')}
          />

          <InputField
            errors={errors}
            control={control}
            name="lastName"
            placeholder={t('auth.register.lastNamePlaceholder')}
          />
        </Grid>
        <InputField
          errors={errors}
          control={control}
          name="username"
          placeholder={t('auth.register.userNamePlaceholder')}
        />

        <InputField errors={errors} control={control} name="email" placeholder={t('auth.register.emailPlaceholder')} />

        <InputField
          errors={errors}
          control={control}
          name="phoneNumber"
          placeholder={t('auth.register.phoneNumberPlaceholder')}
          type="tel"
        />

        <InputGroup size="lg">
          <InputField
            errors={errors}
            control={control}
            name="password"
            placeholder={t('auth.register.pwdPlaceholder')}
            type={show ? 'text' : 'password'}
          />
          <InputRightElement onClick={handleClick} top="5%">
            {show ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
          </InputRightElement>
        </InputGroup>

        <InputGroup size="lg">
          <InputField
            errors={errors}
            control={control}
            name="confirmPassword"
            placeholder={t('auth.register.confirmPwdPlaceholder')}
            type={show ? 'text' : 'password'}
          />
          <InputRightElement onClick={handleClick} top="5%">
            {show ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
          </InputRightElement>
        </InputGroup>

        <CalendarField
          name="dob"
          errors={errors}
          control={control}
          panelClassName="override-panel"
          placeholder={t('auth.register.dobPlaceholder')}
        />
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              <Grid templateColumns="repeat(2,1fr)" gap={6}>
                <Radio value="0" isRequired>
                  Male
                </Radio>
                <Radio value="1" isRequired>
                  Female
                </Radio>
              </Grid>
            </RadioGroup>
          )}
        />

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

        <Flex justify="center" align="center">
          <Text mr="0.25rem">{t('auth.register.subTitle.3')}</Text>
          <Link to={PATH.login}>
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
