import { FormControl, FormErrorMessage, Grid, Radio, RadioGroup } from '@chakra-ui/react';
import _ from 'lodash';
import React from 'react';
import { Controller } from 'react-hook-form';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import { USER_SEXUAL } from '~/app/constants';

const RadioField = (props) => {
  const { name, errors, control } = props;

  const isError = errors[name] ? true : false;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        field.value = field.value.toString();
        return (
          <FormControl isInvalid={isError}>
            <RadioGroup {...field}>
              <Grid templateColumns="repeat(2,1fr)">
                <Radio value={_.findKey(USER_SEXUAL, (o) => o === 'male')} size="lg">
                  Male
                </Radio>
                <Radio value={_.findKey(USER_SEXUAL, (o) => o === 'female')} size="lg">
                  Female
                </Radio>
              </Grid>
            </RadioGroup>

            {isError && (
              <FormErrorMessage>
                {errors[name].message} <BsFillExclamationCircleFill />
              </FormErrorMessage>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default RadioField;
