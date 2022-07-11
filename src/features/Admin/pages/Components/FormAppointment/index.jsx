import { Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { CalendarField, InputField } from '~/components';
import { selectLoggedUser } from '~/features/Auth/authSlice';

import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import moment from 'moment';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES } from '~/app/constants';
import styles from '../styles/common.module.scss';

const cx = classNames.bind(styles);

// initial validation rules
const schema = yup
  .object({
    date: yup.date().required('Date is required').min(moment().toDate(), 'End date must be after now'),
    total: yup.number().required('Total is required').min(0, 'Total must be greater than 0')
  })
  .required();

const FormAppointment = ({ t, defaultValues, BtnRef, callback, isEdit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const userInfo = useSelector(selectLoggedUser);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        const { code, message } = await axios.put(API_ROUTES.bookings, {
          ...data,
          date: moment(data.startDate).toISOString(true),
          userId: userInfo.id
        });
        if (+code === API_CODE.OK) {
          toast.success(message);
          if (typeof callback === 'function') callback();
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: 'auto' }}>
      <Flex direction="column" gap="3rem" h="auto" pt="2rem" pb="5rem">
        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            total
          </Heading>
          <InputField
            errors={errors}
            control={control}
            type="number"
            name="total"
            placeholder="Enter Total"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            Date
          </Heading>
          <CalendarField
            name="date"
            errors={errors}
            control={control}
            inputClassName={cx('user-edit-calendar-input')}
            placeholder={t('auth.register.dobPlaceholder')}
          />
        </Flex>

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormAppointment);
