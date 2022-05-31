import { Switch, Tooltip, useColorMode } from '@chakra-ui/react';
import React from 'react';

const ToggleColorButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Tooltip
        offset={[0, 10]}
        fontSize="1.2rem"
        placement="bottom"
        textTransform="capitalize"
        shouldWrapChildren
        closeOnClick={false}
        label={colorMode}
        hasArrow
      >
        <Switch
          isChecked={colorMode === 'dark' ? true : false}
          size="lg"
          colorScheme="purple"
          onChange={toggleColorMode}
        />
      </Tooltip>
    </>
  );
};

export default ToggleColorButton;
