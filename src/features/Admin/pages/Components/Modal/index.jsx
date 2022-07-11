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
import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import FormAppointment from '../FormAppointment';
import FormClinic from '../FormClinic';
import FormDentist from '../FormDentist';
import FormDiscount from '../FormDiscount';
import FormService from '../FormService';
import FormUser from '../FormUser';

const MOCK_DATA = {
  clinic: {
    value: 'clinics',
    defaultValues: {
      description: '',
      name: '',
      address: '',
      phone: ''
    }
  },
  user: {
    value: 'users',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      dob: '',
      gender: 0
    }
  },
  dentist: {
    value: 'dentists',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dob: '',
      gender: '',
      position: '',
      description: '',
      clinicId: '',
      serviceId: []
    }
  },
  service: {
    value: 'services',
    defaultValues: {
      serviceName: '',
      procedure: '',
      status: 0,
      price: 0,
      discountId: null
    }
  },
  discount: {
    value: 'discounts',
    defaultValues: {
      title: '',
      startDate: null,
      endDate: null,
      description: '',
      percent: 0,
      amount: 0,
      applyForAll: false
    }
  },
  appointment: {
    value: 'appointments',
    defaultValues: {
      date: null,
      total: 0
    }
  }
};

const CustomModal = ({ label, data, isOpen, onClose, callback, minW = '40vw', minH = '85vh' }) => {
  const { user, clinic, dentist, service, discount, appointment } = MOCK_DATA;

  const BtnRef = useRef();
  const [loading, setLoading] = useState(false);

  const renderFormEdit = () => {
    switch (label) {
      case appointment.value:
        return (
          <FormAppointment
            BtnRef={BtnRef}
            defaultValues={data ? data : appointment.defaultValues}
            callback={callback}
            isEdit={data ? true : false}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case discount.value:
        return (
          <FormDiscount
            BtnRef={BtnRef}
            defaultValues={data ? data : discount.defaultValues}
            callback={callback}
            isEdit={data ? true : false}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case service.value:
        return (
          <FormService
            BtnRef={BtnRef}
            defaultValues={data ? data : service.defaultValues}
            callback={callback}
            isEdit={data ? true : false}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case clinic.value:
        return (
          <FormClinic
            BtnRef={BtnRef}
            defaultValues={data ? data : clinic.defaultValues}
            callback={callback}
            isEdit={data ? true : false}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case user.value:
        return (
          <FormUser
            BtnRef={BtnRef}
            loading={loading}
            setLoading={setLoading}
            defaultValues={data ? data : user.defaultValues}
            callback={callback}
          />
        );
      case dentist.value:
        return (
          <FormDentist
            BtnRef={BtnRef}
            defaultValues={data ? data : dentist.defaultValues}
            loading={loading}
            setLoading={setLoading}
            callback={callback}
            isEdit={data ? true : false}
          />
        );
    }
  };

  const submitBtnPassProps = !loading
    ? {
        as: motion.button,
        whileHover: { scale: 0.9 },
        whileTap: { scale: 1.1 }
      }
    : { _hover: {} };

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay zIndex="1" />
      <ModalContent minW={minW} minH={minH} borderRadius="2rem" pt="4rem">
        <ModalHeader fontSize="3rem" textTransform="capitalize" fontWeight="800" px="3rem">
          {data ? 'edit' : 'create'} {label} profile
        </ModalHeader>
        <ModalCloseButton top="2rem" right="2rem" />
        <ModalBody position="relative">
          <Flex position="absolute" inset="0" w="100%" h="100%" px="3rem" overflow="auto">
            {renderFormEdit()}
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
            {...submitBtnPassProps}
            isDisabled={loading}
            textTransform="capitalize"
            variant="primary"
            bg="primary.500"
            color="white"
            py="2rem"
            borderRadius="0.8rem"
            fontSize="1.5rem"
            w="15rem"
            fontWeight="500"
            onClick={() => {
              BtnRef.current.click();
            }}
          >
            save changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default withTranslation()(CustomModal);
