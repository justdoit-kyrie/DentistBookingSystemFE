/* eslint-disable indent */
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import { withTranslation } from 'react-i18next';
import './Modal.scss';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FormEdit } from '..';

// initial values
const defaultValues = {
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  dob: '',
  gender: 0
};

const CustomModal = ({ customer, isOpen, onClose }) => {
  const BtnRef = useRef();

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay zIndex="1" />
      <ModalContent minW="40vw" minH="85vh" borderRadius="2rem" pt="4rem">
        <ModalHeader fontSize="3rem" textTransform="capitalize" fontWeight="800" px="3rem">
          edit clinic profile
        </ModalHeader>
        <ModalCloseButton top="2rem" right="2rem" />
        <ModalBody position="relative">
          <Flex position="absolute" inset="0" w="100%" h="100%" px="3rem" overflow="auto">
            {customer && <FormEdit BtnRef={BtnRef} defaultValues={customer ? customer : defaultValues} />}
          </Flex>
        </ModalBody>

        <ModalFooter bgColor="grey.100" borderRadius="0 0 2rem 2rem" p="2rem">
          <Button
            textTransform="capitalize"
            py="2rem"
            bg="transparent"
            borderRadius="0.8rem"
            fontSize="1.5rem"
            w="12rem"
            fontWeight="500"
            _hover={{
              bg: 'transparent',
              textDecor: 'underline'
            }}
            _focus={{}}
            _active={{}}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            as={motion.button}
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 1.1 }}
            textTransform="capitalize"
            variant="primary"
            color="white"
            py="2rem"
            borderRadius="0.8rem"
            fontSize="1.5rem"
            w="15rem"
            fontWeight="500"
            onClick={() => BtnRef.current.click()}
          >
            save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default withTranslation()(CustomModal);
