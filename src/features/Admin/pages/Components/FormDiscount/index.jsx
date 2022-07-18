import { Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { CalendarField, CheckboxField, InputField } from '~/components';
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
    title: yup.string().required('Title is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date().required('End date is required').min(yup.ref('startDate'), 'End date must be after start date'),
    amount: yup.number().required('Amount is required').min(0, 'Amount must be greater than 0'),
    percent: yup.number().required('Percent is required').min(0, 'Amount must be greater than 0')
  })
  .required();

const FormDiscount = ({ t, onClose, defaultValues, BtnRef, callback, isEdit }) => {
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
        const { code, message } = await axios.put(API_ROUTES.discounts, {
          ...data,
          startDate: moment(data.startDate).toISOString(true),
          endDate: moment(data.endDate).toISOString(true),
          userId: userInfo.id
        });
        if (+code === API_CODE.OK) {
          toast.success(message);
          if (typeof callback === 'function') callback();
        }
      } else {
        const { code, message } = await axios.post(API_ROUTES.discounts, {
          ...data,
          startDate: moment(data.startDate).toISOString(true),
          endDate: moment(data.endDate).toISOString(true),
          userId: userInfo.id
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
            title
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="title"
            placeholder="Enter Title"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>
        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            description
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="description"
            placeholder="Enter description"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>
        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            percent
          </Heading>
          <InputField
            errors={errors}
            control={control}
            type="number"
            name="percent"
            placeholder="Enter percent"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>
        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            amount
          </Heading>
          <InputField
            errors={errors}
            control={control}
            type="number"
            name="amount"
            placeholder="Enter percent"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            start Date
          </Heading>
          <CalendarField
            name="startDate"
            errors={errors}
            control={control}
            inputClassName={cx('user-edit-calendar-input')}
            placeholder={t('auth.register.dobPlaceholder')}
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            end Date
          </Heading>
          <CalendarField
            name="endDate"
            errors={errors}
            control={control}
            inputClassName={cx('user-edit-calendar-input')}
            placeholder={t('auth.register.dobPlaceholder')}
          />
        </Flex>

        <CheckboxField name="applyForAll" errors={errors} control={control} label="apply for all" size="lg" />

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormDiscount);
