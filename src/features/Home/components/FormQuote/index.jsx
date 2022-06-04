import { Button, Grid, useColorMode, useMediaQuery } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { InputField, TextareaField } from '~/components';
import styles from './FormQuote.scss';

const cx = classNames.bind(styles);

const defaultValues = {
  fullName: '',
  email: '',
  phone: '',
  website: '',
  message: ''
};

// eslint-disable-next-line no-unused-vars
const FormQuote = ({ t, tReady, ...passProps }) => {
  const { colorMode } = useColorMode();
  const [isLessThan1023] = useMediaQuery('(max-width: 1023px)');

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues
  });
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid gridTemplateColumns="repeat(2, 1fr)" className={cx('form-quote')} gap="4rem" my="5rem" {...passProps}>
        <InputField
          errors={errors}
          control={control}
          name="fullName"
          placeholder={t('home.quote.form.placeHolder.fullName')}
          border="none"
          borderBottom="1px solid"
          borderColor={colorMode === 'light' ? 'grey.300' : 'white'}
          borderRadius="0"
          _focus={{ borderColor: 'grey.300', boxShadow: 'none' }}
          fontSize="1.5rem"
        />
        <InputField
          errors={errors}
          control={control}
          name="email"
          placeholder={t('home.quote.form.placeHolder.email')}
          border="none"
          borderBottom="1px solid"
          borderColor={colorMode === 'light' ? 'grey.300' : 'white'}
          borderRadius="0"
          _focus={{ borderColor: 'grey.300', boxShadow: 'none' }}
          fontSize="1.5rem"
        />
        <InputField
          errors={errors}
          control={control}
          name="phone"
          placeholder={t('home.quote.form.placeHolder.phone')}
          border="none"
          borderBottom="1px solid"
          borderColor={colorMode === 'light' ? 'grey.300' : 'white'}
          borderRadius="0"
          _focus={{ borderColor: 'grey.300', boxShadow: 'none' }}
          fontSize="1.5rem"
        />
        <InputField
          errors={errors}
          control={control}
          name="website"
          placeholder={t('home.quote.form.placeHolder.website')}
          border="none"
          borderBottom="1px solid"
          borderColor={colorMode === 'light' ? 'grey.300' : 'white'}
          borderRadius="0"
          _focus={{ borderColor: 'grey.300', boxShadow: 'none' }}
          fontSize="1.5rem"
        />
        <TextareaField
          name="message"
          errors={errors}
          control={control}
          placeholder={t('home.quote.form.placeHolder.message')}
          border="none"
          borderBottom="1px solid"
          borderRadius="0"
          borderColor={colorMode === 'light' ? 'grey.300' : 'white'}
          _hover={{ borderColor: colorMode === 'light' ? 'grey.300' : 'white' }}
          _focus={{ borderColor: colorMode === 'light' ? 'grey.300' : 'white', boxShadow: 'none' }}
          fontSize="1.5rem"
          minH="17rem"
          resize="none"
        />
      </Grid>
      <Button
        type="submit"
        variant="primary-circle"
        minW="40%"
        h="6rem"
        fontSize="1.75rem"
        color="white"
        bg="primary.500"
        mb={isLessThan1023 ? '2rem' : '0'}
        _hover={{
          bg: 'transparent',
          color: 'primary.500',
          border: '1px solid',
          borderColor: 'primary.500'
        }}
      >
        {t('home.quote.form.action')}
      </Button>
    </form>
  );
};

export default withTranslation()(FormQuote);
