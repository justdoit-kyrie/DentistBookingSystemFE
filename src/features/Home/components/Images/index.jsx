import { Box, Center, Grid, Square } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import Lightbox from 'react-image-lightbox';
import styles from '../../Home.module.scss';

const cx = classNames.bind(styles);

const effect = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.25,
      staggerChildren: 0.5
    }
  }
};

const children_effect = {
  initial: {
    y: 100,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'tween' }
  }
};

const Images = ({ preview }) => {
  const [selectedImage, setSelectedImage] = useState('');

  return (
    <Grid
      as={motion.div}
      variants={effect}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      mt="7rem"
      gap="2rem"
      gridTemplateColumns="repeat(auto-fit,minmax(374px, 1fr))"
      overflow="hidden"
    >
      {preview.map((item, index) => (
        <Center
          as={motion.div}
          variants={children_effect}
          key={`${index}`}
          bg={`url('${item}') no-repeat center center`}
          w="100%"
          h="45rem"
          className={cx('image-item')}
          position="relative"
        >
          <Box className={cx('image-item-wrapper')}>
            <Square
              size="5rem"
              bg="primary.500"
              cursor="pointer"
              className={cx('image-item-box')}
              onClick={() => setSelectedImage(item)}
            ></Square>
            <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
              <BiSearch fontSize="2rem" color="white" />
            </Box>
          </Box>
        </Center>
      ))}

      {selectedImage && (
        <Lightbox
          mainSrc={selectedImage}
          onCloseRequest={() => setSelectedImage('')}
          imageLoadErrorMessage="Error preview image"
        />
      )}
    </Grid>
  );
};

export default Images;
