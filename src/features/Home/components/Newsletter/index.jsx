import { Box, Button, Flex, Input, useMediaQuery } from '@chakra-ui/react';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { FeatureBlock } from '..';

const Newsletter = ({ t, newsletter, effect }) => {
  const [newsletterField, setNewsletterField] = useState();
  const [isLessThan767] = useMediaQuery('(max-width: 767px)');

  return (
    <Box bg="linearGradient.100" p={isLessThan767 ? '0.05rem 0 5rem 0' : '5rem 0'}>
      <FeatureBlock header={newsletter} effect={effect} mt="0">
        <Flex
          sx={{
            '@media screen and (max-width: 1023px)': {
              maxW: ' 50%'
            },
            '@media screen and (max-width: 767px)': {
              maxW: ' 100%'
            }
          }}
          className="newsletter"
          maxW="30%"
          m="-5rem auto 0"
        >
          <Input
            flex="0.8"
            h="100%"
            placeholder={t('home.newsletter.placeholder')}
            _placeholder={{ color: 'white' }}
            _focus={{ boxShadow: 'none' }}
            _hover={{
              borderColor: 'currentcolor'
            }}
            p="1.5rem 1rem"
            color="white"
            borderColor="currentcolor"
            fontSize="1.5rem"
            borderRadius="20px 0 0 20px"
            value={newsletterField}
            onChange={(e) => setNewsletterField(e.target.value)}
          />
          <Box flex="0.25">
            <Button
              w="100%"
              h="100%"
              borderRadius="0 20px 20px 0"
              bg="transparent"
              border="1px solid"
              borderLeft="none"
              fontSize="1.5rem"
              color="white"
              borderColor="currentcolor"
              _hover={{
                bg: 'transparent',
                color: 'white'
              }}
            >
              {t('home.newsletter.action')}
            </Button>
          </Box>
        </Flex>
      </FeatureBlock>
    </Box>
  );
};

export default withTranslation()(Newsletter);
