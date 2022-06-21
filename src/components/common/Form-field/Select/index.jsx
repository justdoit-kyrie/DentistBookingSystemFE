import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import React from 'react';
import { Controller } from 'react-hook-form';
import { BsFillExclamationCircleFill } from 'react-icons/bs';

const SelectField = (props) => {
  const { name, errors, options, control, placeholder, multiple, ...passProps } = props;

  const isError = errors[name] ? true : false;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControl isInvalid={isError}>
            {multiple ? (
              <MultiSelect
                {...field}
                options={options}
                placeholder={placeholder}
                {...passProps}
                className={`${passProps.className} ${isError ? 'is-invalid' : ''}`}
              />
            ) : (
              <Dropdown
                {...field}
                options={options}
                placeholder={placeholder}
                {...passProps}
                className={`${passProps.className} ${isError ? 'is-invalid' : ''}`}
              />
            )}
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

export default SelectField;
