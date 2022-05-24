import { FormControl, FormErrorMessage, Input, InputGroup, InputRightElement, useColorMode } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

const InputField = (props) => {
  const { name, errors, control, type = 'text', placeholder, rightIcon, rightIconActive } = props;
  const [isFocus, setIsFocus] = useState(false);
  const { colorMode } = useColorMode();

  const IconComponent = isFocus ? rightIconActive : rightIcon;

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

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControl isInvalid={isError}>
            <InputGroup>
              <Input
                {...field}
                borderColor={colorMode === 'light' ? 'grey.300' : 'white'}
                _hover={colorMode === 'light' ? 'grey.300' : 'white'}
                onFocus={() => setIsFocus(!isFocus)}
                onBlur={() => setIsFocus(false)}
                type={type}
                placeholder={placeholder}
                _placeholder={{ color: colorMode === 'light' ? 'grey.500' : 'white.200' }}
                h="3.5rem"
                fontSize="1.2rem"
              />
              {rightIcon && rightIconActive && (
                <InputRightElement pointerEvents="none" top="50%" right="0.75rem" transform="translateY(-50%)">
                  <IconComponent color={iconColor} fontSize="1.1rem" />
                </InputRightElement>
              )}
            </InputGroup>
            {isError && <FormErrorMessage>{errors[name].message}</FormErrorMessage>}
          </FormControl>
        );
      }}
    />
  );
};

export default InputField;
