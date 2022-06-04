import { Flex, Heading, Image, Text, useMediaQuery } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { FeatureBlock } from '..';

const Features = ({ effect, children_effect, feature }) => {
  const { title, desc, category } = feature;

  const [isLessThan1279] = useMediaQuery('(max-width: 1279px)');

  return (
    <FeatureBlock id="feature" header={{ title, desc }} effect={effect}>
      <Flex gap="2rem" wrap="wrap">
        {category.map(({ img, title, desc }, index) => (
          <Flex
            as={motion.div}
            variants={children_effect}
            key={`${index}`}
            flex="1"
            direction="column"
            gap="1.5rem"
            justify="center"
            align="center"
            fontSize="1.6rem"
            p="2rem"
          >
            <Flex
              justify="center"
              align="center"
              p="2rem"
              bg="#f8fbff"
              borderRadius="100rem"
              w="10rem"
              h="10rem"
              mb="1rem"
            >
              <Image w="85%" h="85%" src={img} alt="image" />
            </Flex>
            <Heading variants="normal" fontSize={isLessThan1279 ? '1.8rem' : '2.5rem'}>
              {title}
            </Heading>
            <Text color="grey" textAlign="center">
              {desc}
            </Text>
          </Flex>
        ))}
      </Flex>
    </FeatureBlock>
  );
};

export default Features;
