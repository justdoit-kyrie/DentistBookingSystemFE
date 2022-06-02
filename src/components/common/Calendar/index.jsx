import { FormControl, FormErrorMessage, InputGroup, InputRightElement, useColorMode } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { Calendar } from 'primereact/calendar';
import React, { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

const CalendarField = (props) => {
  const { name, errors, control, type = 'text', placeholder, rightIcon, rightIconActive, id, panelClassName } = props;
  const [isFocus, setIsFocus] = useState(false);

  const IconComponent = isFocus ? rightIconActive : rightIcon;

  const { colorMode } = useColorMode();

  const isError = errors[name] ? true : false;
  const iconColor = useMemo(() => {
    if (isFocus) {
      return '#3182ce';
    }
    if (isError) {
      return 'red';
    }
    return '';
  }, [isFocus]);

  const getBorderColor = () => {
    if (isError && colorMode === 'dark') {
      return '#FC8181';
    }
    if (isError && colorMode === 'light') {
      return '#E53E3E';
    }
    if (!isError && colorMode === 'light') {
      return 'var(--chakra-colors-grey-300)';
    }
  };

  const getBoxShadowColor = () => {
    if (isError && colorMode === 'light') {
      return '0 0 0 1px #e53e3e';
    }
    if (isError && colorMode === 'dark') {
      return '0 0 0 1px #fc8181';
    }
  };
  

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControl isInvalid={isError}>
            <InputGroup>
              <Calendar
                {...field}
                onFocus={() => setIsFocus(!isFocus)}
                onBlur={() => setIsFocus(false)}
                type={type}
                id={id}
                placeholder={placeholder}
                h="3.5rem"
                fontSize="1.2rem"
                inputStyle={{
                  borderColor: getBorderColor(),
                  boxShadow: getBoxShadowColor()
                }}
                dateFormat="yy-mm-dd"
                panelClassName={panelClassName}
                panelStyle={{
                  border: '1px solid #63b3ed',
                  color: 'inherit',
                  background: 'inherit',
                  boxShadow: '0 0 0 1px #63b3ed'
                }}
                showButtonBar
              />
              {rightIcon && rightIconActive && (
                <InputRightElement pointerEvents="none" top="50%" right="0.75rem" transform="translateY(-50%)">
                  <IconComponent color={iconColor} fontSize="1.1rem" />
                </InputRightElement>
              )}
            </InputGroup>
            {isError && (
              <FormErrorMessage>
                {errors[name].message} <WarningIcon w={3} h={3} color="red.500" />
              </FormErrorMessage>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default CalendarField;
