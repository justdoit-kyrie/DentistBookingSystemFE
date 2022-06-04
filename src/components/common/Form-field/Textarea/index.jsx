import { FormControl, FormErrorMessage, Textarea } from '@chakra-ui/react';
import React from 'react';
import { Controller } from 'react-hook-form';

const TextareaField = (props) => {
  const { name, errors, control, placeholder, ...passProps } = props;

  const isError = errors[name] ? true : false;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControl isInvalid={isError}>
            <Textarea {...field} placeholder={placeholder} {...passProps} />
            {isError && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
          </FormControl>
        );
      }}
    />
  );
};

export default TextareaField;
