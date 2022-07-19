/* eslint-disable no-unused-vars */
import { Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { CalendarField, InputField, SelectField } from '~/components';
import { selectLoggedUser } from '~/features/Auth/authSlice';

import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import moment from 'moment';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, STATUS_CODE } from '~/app/constants';
import styles from '../styles/common.module.scss';
import _ from 'lodash';

const cx = classNames.bind(styles);

const FormAppointment = ({ t, onClose, defaultValues, BtnRef, callback, isEdit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
  });

  const userInfo = useSelector(selectLoggedUser);

  const onSubmit = async (data) => {
    try {
      const tmp = _.invert(STATUS_CODE);
      if (isEdit) {
        const { code, message } = await axios.put(`${API_ROUTES.bookings}/status`, {
          ...data,
          status: +tmp[data.status],
          bookingId: data.id
        });
        if (+code === API_CODE.OK) {
          toast.success(message);
          if (typeof callback === 'function') callback();
          onClose();
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
            Status
          </Heading>
          <SelectField
            className="select-field"
            placeholder="Enter a Status"
            name="status"
            errors={errors}
            control={control}
            options={_.values(STATUS_CODE)}
          />
        </Flex>

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormAppointment);
