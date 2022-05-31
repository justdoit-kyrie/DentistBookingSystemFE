/* eslint-disable no-unused-vars */
import {
  // Box,
  Button,
  Flex,
  Grid,
  Text,
  Radio,
  RadioGroup,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import classnames from 'classnames/bind';
import React, { useState } from 'react';
// import GoogleLogin from 'react-google-login';
import { useForm } from 'react-hook-form';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { PWD_REGEX } from '~/app/constants';
import { InputField } from '~/components';
import styles from './FormRegister.module.scss';
// import { AiOutlineGoogle } from 'react-icons/ai';
import { withTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CalendarField } from '~/components';
import './FormRegister.scss';
import { axios } from '~/apis';

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

// Render years

const FormRegister = ({ t }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
    // resolver: yupResolver(schema)
  });
  const onSubmit = async (data) => {
    try {
      console.log('data', data);
      const { code, message } = await axios.post('/register', { ...data });
      if(+code === 200) {
        // redirect to login
      }else {
        // show toast
      }
    } catch (error) {
      // show toast
    }
  };

  const [gender, setGender] = React.useState();

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [date1, setDate1] = useState(null);

  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;
  let minDate = new Date();
  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);

  let maxDate = new Date();
  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  // const handleResponseGoogle = (response) => {
  //   console.log({ response });
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ position: '' }}>
      <Flex direction="column" gap="2rem">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <InputField
            errors={errors}
            control={control}
            name="firtName"
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
          <InputRightElement onClick={handleClick} top="50%" right="0.75rem" transform="translateY(-50%)">
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
          <InputRightElement onClick={handleClick} top="50%" right="0.75rem" transform="translateY(-50%)">
            {show ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
          </InputRightElement>
        </InputGroup>

        <CalendarField
          name="dob"
          errors={errors}
          control={control}
          id={cx('override-calendar')}
          panelClassName="override-panel"
          placeholder={t('auth.register.dobPlaceholder')}
          value={date1}
          onChange={(e) => setDate1(e.value)}
        />

        <RadioGroup name="gender" onChange={setGender} value={gender}>
          <Grid templateColumns="repeat(2,1fr)" gap={6}>
            <Radio name="gender" value="Male" size="lg" fontSize="2rem">
              {t('auth.register.genderMalePlaceHolder')}
            </Radio>
            <Radio name="gender" value="Female" size="lg" fontSize="2rem">
              {t('auth.register.genderFemalePlaceHolder')}
            </Radio>
          </Grid>
        </RadioGroup>
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
        {/* <Box>
          <Text className={cx('line')}>{t('auth.register.subTitle.2')}</Text>
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
        /> */}
        <Flex justify="center" align="center">
          <Text mr="0.25rem">{t('auth.register.subTitle.3')}</Text>
          <Link to="/login">
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
