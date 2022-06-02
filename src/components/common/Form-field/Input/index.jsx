import { WarningIcon } from '@chakra-ui/icons';
import { FormControl, FormErrorMessage, Input, InputGroup, InputRightElement, useColorMode } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { COLORS } from '~/app/constants';

const InputField = (props) => {
  const { name, errors, control, type = 'text', placeholder, rightIcon, rightIconActive } = props;
  const [isFocus, setIsFocus] = useState(false);
  const { colorMode } = useColorMode();

  const IconComponent = isFocus ? rightIconActive : rightIcon;

  const isError = errors[name] ? true : false;
  const iconColor = useMemo(() => {
    if (isFocus) {
      return COLORS.primary[200];
    }
    if (isError) {
      return COLORS.red[500];
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
                  <IconComponent color={iconColor} fontSize="1.7rem" />
                </InputRightElement>
              )}
            </InputGroup>
            {isError && <FormErrorMessage>{errors[name].message} <WarningIcon w={3} h={3} color="red.500"></WarningIcon></FormErrorMessage>}
          </FormControl>
        );
      }}
    />
  );
};

export default InputField;
