import { Checkbox, FormControl, FormErrorMessage } from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';
import { BsFillExclamationCircleFill } from 'react-icons/bs';

const CheckboxField = (props) => {
  const { name, errors, control, label, ...passProps } = props;

  const isError = errors[name] ? true : false;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControl isInvalid={isError}>
            <Checkbox {...field} isInvalid={isError} colorScheme="green" defaultChecked={field.value} {...passProps}>
              {label}
            </Checkbox>
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

export default CheckboxField;
