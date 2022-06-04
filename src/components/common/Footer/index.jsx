import { Box, Circle, Flex, Heading, Text, useMediaQuery } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { AiFillMail } from 'react-icons/ai';
import { BsHeartFill, BsTwitter } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';
import { ImLocation, ImPhone } from 'react-icons/im';

const effect = {
  initial: {
    y: 200,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
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
    transition: { type: 'spring' }
  }
};

const MOCK_DATA = {
  socials: [
    {
      icon: BsTwitter,
      href: '#'
    },
    {
      icon: FaFacebookF,
      href: '#'
    },
    {
      icon: FiInstagram,
      href: '#'
    }
  ],
  links: (t) => [
    {
      href: '#about',
      value: t('home.footer.links.about')
    },
    {
      href: '#feature',
      value: t('home.footer.links.feature')
    },
    {
      href: '#dentist',
      value: t('home.footer.links.dentist')
    },
    {
      href: '#clinic',
      value: t('home.footer.links.clinic')
    },
    {
      href: '#service',
      value: t('home.footer.links.service')
    }
  ],
  info: (t) => [
    { icon: ImLocation, value: t('home.footer.links.address') },
    { icon: ImPhone, value: t('home.footer.links.phone'), href: `tel:${t('home.footer.links.phone')}` },
    { icon: AiFillMail, value: t('home.footer.links.mail'), href: `mailto:${t('home.footer.links.mail')}` }
  ]
};

const Footer = ({ t }) => {
  const { socials, info, links } = MOCK_DATA;

  const [isLessThan1023] = useMediaQuery('(max-width: 1023px)');
  const [isLessThan767] = useMediaQuery('(max-width: 767px)');

  return (
    <Box bg="black.500" color="white" fontSize="1.5rem" pt="10rem" pb="10rem">
      <Box className="container">
        <Flex justify="space-between" direction={isLessThan1023 ? 'column' : 'row'} gap="4rem">
          <Flex direction="column" gap="2rem">
            <Heading variant="medium">DentaCare.</Heading>
            <Text maxW="80%" color="desc.500">
              {t('home.footer.desc')}
            </Text>
            <Flex
              gap="1rem"
              as={motion.div}
              variants={effect}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {socials.map((item, index) => {
                const IconCop = item.icon;
                return (
                  <a key={`${index}`} href={item.href} target="_blank" rel="noopener noreferrer">
                    <Circle as={motion.div} variants={children_effect} p="1rem" bg="black.100" fontSize="2rem">
                      <IconCop />
                    </Circle>
                  </a>
                );
              })}
            </Flex>
          </Flex>

          <Flex w="fit-content" direction={isLessThan767 ? 'column' : 'row'} gap="4rem">
            <Box flex="0.6" pr="3rem">
              <Heading mb="2rem" variant="normal">
                {t('home.footer.heading.0')}
              </Heading>
              <Flex direction="column" gap="1rem" color="desc.500">
                {links(t).map(({ href, value }, index) => (
                  <a key={`${index}`} href={href}>
                    <Text textTransform="capitalize">{value}</Text>
                  </a>
                ))}
              </Flex>
            </Box>
            <Box flex="1">
              <Heading variant="normal" mb="2rem">
                {t('home.footer.heading.1')}
              </Heading>
              <Flex direction="column" gap="1rem">
                {info(t).map((item, index) => {
                  const IconComp = item.icon;
                  const Wrapper = item.href ? 'a' : Fragment;
                  const passProps = item.href ? { href: item.href } : {};
                  return (
                    <Wrapper key={`${index}`} {...passProps}>
                      <Flex gap="1rem" align="flex-start">
                        <IconComp fontSize="2rem" />
                        <Text color="desc.500">{item.value}</Text>
                      </Flex>
                    </Wrapper>
                  );
                })}
              </Flex>
            </Box>
          </Flex>
        </Flex>
        {isLessThan767 ? (
          <Text mt="5rem" align="center">
            {t('home.footer.copyRight', { name: 'NKTD', joinArrays: ' ' })}
          </Text>
        ) : (
          <Flex align="center" mt="10rem" justify="center" gap="0.5rem" fontSize="1.75rem" color="desc.500">
            <Text as="span">{t('home.footer.copyRight.0')} </Text>
            <Text as="span">
              <BsHeartFill />
            </Text>
            <Text as="span">{t('home.footer.copyRight.1', { name: 'NKTD' })}</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default withTranslation()(Footer);
