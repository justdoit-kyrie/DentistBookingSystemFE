import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { TitleBlock } from '..';

const FeatureBlock = (props) => {
  const { effect, header, children } = props;
  const { title, desc } = header;
  return (
    <Box
      mt="7rem"
      className="container"
      as={motion.div}
      variants={effect}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      <TitleBlock title={title} desc={desc} fontSize="1.5rem" maxW="50%" m="0 auto" textAlign="center" />
      <Box mt="10rem" position="relative">
        {children}
      </Box>
    </Box>
  );
};

export default FeatureBlock;
