import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import * as yup from 'yup';
import { API_CODE, API_ROUTES, DATE_FORMAT } from '~/app/constants';
import { InputField, JoditField, SelectField } from '~/components';

import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { selectLoggedUser } from '~/features/Auth/authSlice';

// initial validation rules
const schema = yup
  .object({
    discountId: yup.number().required('discount is required'),
    serviceName: yup.string().required('Name is required'),
    price: yup.number().required('price is required').min(1, 'Price must be greater than 1')
  })
  .required();

// eslint-disable-next-line no-unused-vars
const FormService = ({ t, defaultValues, BtnRef, callback, isEdit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const userInfo = useSelector(selectLoggedUser);

  const [discountOpt, setDiscountOpt] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { code, content } = await axios.get(API_ROUTES.discounts, {
        params: { _all: true, _by: 'id', _order: '-1' }
      });

      if (+code === API_CODE.OK) {
        const listEntries = _.toPairs(
          _.groupBy(
            content.map((item) => ({ ...item, startDate: moment(item.startDate).format(DATE_FORMAT['DD/MM/YYYY']) })),
            (o) => o.startDate
          )
        );

        setDiscountOpt(
          listEntries.reduce((initial, [key, values]) => {
            initial.push({ label: key, items: values });
            return initial;
          }, [])
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const groupedItemTemplate = (option) => {
    return (
      <Text fontSize="1.2rem" bg="rgba(0, 0, 0, 0.04)" p="0.5rem 1rem" w="fit-content" userSelect="none">
        {option.label}
      </Text>
    );
  };

  const itemTemplate = (option) => {
    return (
      <Flex justify="space-between" align="center" fontSize="1.2rem" p="0.5rem">
        <Flex direction="column" gap="0.5rem">
          <Text fontWeight="700" fontSize="1.3rem">
            {option.title}
          </Text>
          <Flex align="baseline" gap="0.2rem">
            <Text as="span" textTransform="capitalize">
              amount:
            </Text>
            <Text as="span" fontWeight="800">
              {option.amount}
            </Text>
          </Flex>
        </Flex>
        <Text fontWeight="700">{`${option.startDate} - ${moment(option.endDate).format(
          DATE_FORMAT['DD-MM-YYYY']
        )}`}</Text>
      </Flex>
    );
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        const { code, message } = await axios.put(API_ROUTES.services, {
          ...data,
          name: data.serviceName,
          userId: userInfo.id
        });
        if (+code === API_CODE.OK) {
          toast.success(message);
          if (typeof callback === 'function') callback();
        }
      } else {
        const { code, message } = await axios.post(API_ROUTES.services, {
          ...data,
          name: data.serviceName,
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
            name
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="serviceName"
            placeholder="Enter Name"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>
        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            price
          </Heading>
          <InputField
            errors={errors}
            control={control}
            type="number"
            name="price"
            placeholder="Enter Price"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            discount
          </Heading>
          <SelectField
            errors={errors}
            control={control}
            options={discountOpt}
            name="discountId"
            placeholder="Select discount"
            className="select-field"
            optionGroupLabel="label"
            optionLabel="title"
            optionValue="id"
            optionGroupChildren="items"
            optionGroupTemplate={groupedItemTemplate}
            itemTemplate={itemTemplate}
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            procedure
          </Heading>
          <JoditField errors={errors} control={control} name="procedure" />
        </Flex>

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormService);
