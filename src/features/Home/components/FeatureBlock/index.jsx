import { Box, useMediaQuery } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { TitleBlock } from '..';

const FeatureBlock = (props) => {
  const { effect, header, mt = '7rem', children, id } = props;
  const { title, desc } = header;

  const [isLessThan1023] = useMediaQuery('(max-width: 1023px)');

  return (
    <Box
      sx={{
        '@media screen and (max-width: 1023px)': {
          mt: '5rem'
        }
      }}
      id={id}
      mt={mt}
      className="container"
      as={motion.div}
      variants={effect}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <TitleBlock title={title} desc={desc} fontSize="1.5rem" m="0 auto" textAlign="center" />
      <Box mt={isLessThan1023 ? '7rem' : '10rem'} position="relative">
        {children}
      </Box>
    </Box>
  );
};

export default FeatureBlock;
