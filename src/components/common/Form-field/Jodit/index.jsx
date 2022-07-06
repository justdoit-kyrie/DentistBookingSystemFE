import { Box } from '@chakra-ui/react';
import JoditEditor from 'jodit-react';
import React from 'react';
import { Controller } from 'react-hook-form';

const config = {
  uploader: {
    insertImageAsBase64URI: true
  },
  language: 'en',
  toolbarButtonSize: 'large',
  enter: 'P',
  defaultMode: '1',
  showCharsCounter: false,
  height: 400,
  minHeight: 400
};

const JoditField = (props) => {
  const { name, control } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Box fontSize="1.4rem">
            <JoditEditor {...field} config={config} tabIndex={1} />
          </Box>
        );
      }}
    />
  );
};

export default JoditField;
