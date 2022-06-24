import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import React from 'react';
import { Controller } from 'react-hook-form';
import { BsFillExclamationCircleFill } from 'react-icons/bs';
import styles from './Select.module.scss';
import { Wrapper } from './style';

const cx = classNames.bind(styles);

const SelectField = (props) => {
  const { name, errors, options, control, placeholder, multiple, ...passProps } = props;

  const isError = errors[name] ? true : false;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const classNames = passProps.className
          .split(' ')
          .map((item) => cx(item))
          .join(' ');
        return (
          <FormControl isInvalid={isError}>
            <Wrapper className={isError ? cx('is-invalid') : ''}>
              {multiple ? (
                <MultiSelect
                  {...field}
                  options={options}
                  placeholder={placeholder}
                  {...passProps}
                  className={`${classNames} ${isError ? cx('is-invalid') : ''}`}
                  panelClassName={cx(passProps.panelClassName)}
                />
              ) : (
                <Dropdown
                  {...field}
                  options={options}
                  placeholder={placeholder}
                  {...passProps}
                  className={`${classNames} ${isError ? cx('is-invalid') : ''}`}
                />
              )}
            </Wrapper>
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
