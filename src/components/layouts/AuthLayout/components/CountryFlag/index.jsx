import { Box } from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import ReactCountryFlag from 'react-country-flag';

const CountryFlag = ({ countryCode, ...passProps }, ref) => {
  return (
    <Box ref={ref} {...passProps}>
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
        cdnSuffix="svg"
        style={{ width: 'auto', height: 'auto' }}
      />
    </Box>
  );
};

export default forwardRef(CountryFlag);
