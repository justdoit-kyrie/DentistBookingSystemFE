import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  Heading,
  Image,
  InputGroup,
  InputRightElement,
  Progress,
  Text
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  API_CODE,
  API_ROUTES,
  DATE_FORMAT,
  EMAIL_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  PWD_REGEX,
  USER_POSITION,
  USER_REGEX
} from '~/app/constants';
import DEFAULT_AVATAR from '~/assets/images/default_avatar.jpg';
import { CalendarField, InputField, Loading, RadioField, SelectField, TextareaField } from '~/components';

import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import _ from 'lodash';
import moment from 'moment';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { MdPhotoCamera } from 'react-icons/md';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { Firebase } from '~/app/firebase';
import styles from '../styles/common.module.scss';

const commonCx = classNames.bind(styles);

const firebase = new Firebase();
const storage = firebase.getStorage();

const MOCK_DATA = {
  'yup-validation': {
    create: {
      gender: yup.string().required('gender is required'),
      position: yup.number().required('position is required'),
      clinicID: yup.number().required('clinic is required'),
      serviceId: yup.array().min(1, 'service is required'),
      username: yup
        .string()
        .required('User name is required')
        .min(5, 'User name must have at least 5 characters')
        .max(30, 'User name must have less than 30 characters')
        .matches(USER_REGEX, 'Please enter a valid user name'),
      password: yup
        .string()
        .required('Password is required')
        .min(8, 'Password is longer than 8 characters')
        .matches(
          PWD_REGEX,
          'Password is at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
      confirmPassword: yup
        .string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
      email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
      phone: yup
        .string()
        .required('Phone number is required')
        .matches(PHONE_REGEX, 'Please enter a valid phone number'),
      firstName: yup.string().required('First name is required').matches(NAME_REGEX, 'Please enter a valid first name'),
      lastName: yup.string().required('Last name is required').matches(NAME_REGEX, 'Please enter a valid last name'),
      dob: yup
        .date()
        .max(moment().subtract(1, 'days').toDate(), 'date of birth must be at earlier than now')
        .required('Please select date of birth')
    },
    edit: {
      gender: yup.string().required('gender is required'),
      position: yup.number().required('position is required'),
      clinicID: yup.number().required('clinic is required'),
      serviceId: yup.array().min(1, 'service is required'),
      email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
      phone: yup
        .string()
        .required('Phone number is required')
        .matches(PHONE_REGEX, 'Please enter a valid phone number'),
      firstName: yup.string().required('First name is required').matches(NAME_REGEX, 'Please enter a valid first name'),
      lastName: yup.string().required('Last name is required').matches(NAME_REGEX, 'Please enter a valid last name'),
      dob: yup
        .date()
        .max(moment().subtract(1, 'days').toDate(), 'date of birth must be at earlier than now')
        .required('Please select date of birth')
    }
  }
};

const FormDentist = ({ t, onClose, defaultValues, BtnRef, loading, setLoading, callback, isEdit }) => {
  const schema = useMemo(() => {
    return defaultValues.username === '' && defaultValues.password === '' && defaultValues.confirmPassword === ''
      ? yup.object(MOCK_DATA['yup-validation'].create).required()
      : yup.object(MOCK_DATA['yup-validation'].edit).required();
  }, []);

  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevImage, setPrevImage] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl || DEFAULT_AVATAR);
  const [clinicsOpt, setClinicsOpt] = useState([]);
  const [servicesOpt, setServicesOpt] = useState([]);
  const [show, setShow] = useState(false);

  const file = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ code: clinicOptCode, content: clinicOptContent }, { code: serviceOptCode, content: serviceOptContent }] =
        await Promise.all([
          axios.get(`${API_ROUTES.clinics}/all`, {
            params: { _all: true, _by: 'id', _order: '-1' }
          }),
          axios.get(API_ROUTES.services, {
            params: { _all: true, _by: 'id', _order: '-1' }
          })
        ]);

      if (+clinicOptCode === API_CODE.OK && +serviceOptCode === API_CODE.OK) {
        setClinicsOpt(clinicOptContent);
        setServicesOpt(serviceOptContent);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const selectedServicesTemplate = (option) => {
    if (option) {
      const { serviceName } = servicesOpt.find((item) => item.id === option) || {};
      return (
        <Box bg="primary.300" p="0.5rem 2rem" borderRadius="2rem" color="white">
          {serviceName}
        </Box>
      );
    }

    return 'Enter Services';
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        const { code, message } = await axios.put(API_ROUTES.dentists, {
          ...data,
          id: data.dentistID,
          gender: +data.gender,
          dob: moment(data.dob).format(DATE_FORMAT['YYYY-MM-DD']),
          imageUrl: imageUrl ? imageUrl : undefined
        });
        if (+code === API_CODE.OK) {
          toast.success(message);
          if (typeof callback === 'function') callback();
        }
      } else {
        const { code, message } = await axios.post(API_ROUTES.dentists, {
          ...data,
          clinicId: data.clinicID,
          gender: +data.gender,
          dob: moment(data.dob).format(DATE_FORMAT['YYYY-MM-DD']),
          imageUrl: imageUrl ? imageUrl : undefined
        });
        if (+code === API_CODE.OK) {
          toast.success(message);
          if (typeof callback === 'function') callback();
          onClose();
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (prevImage) {
        const storageRef = ref(storage, prevImage);
        deleteObject(storageRef).catch((error) => {
          toast.error(error.message);
        });
      }

      if (
        file.type === 'image/png' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/svg' ||
        file.type === 'image/gif'
      ) {
        setLoading(true);
        const storageRef = ref(storage, `${defaultValues.id}_${moment(file.lastModifiedDate).toJSON()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            switch (snapshot.state) {
              case 'paused':
                toast.warning('Upload is paused');
                break;
              case 'running':
                setProgress(progress);
                break;
            }
          },
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setPrevImage(`${defaultValues.id}_${moment(file.lastModifiedDate).toJSON()}_${file.name}`);
              setLoading(false);
              setHover(false);
              setImageUrl(downloadURL);
            });
          }
        );
      } else {
        toast.error('Please select a valid image file');
      }
    } catch (ex) {
      toast.error(ex.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: 'auto' }}>
      <Flex direction="column" gap="3rem" h="auto" pt="2rem" pb="5rem">
        <Circle
          size="20rem"
          overflow="hidden"
          ml="auto"
          mr="auto"
          position="relative"
          onMouseOver={() => setHover(true)}
        >
          {loading && (
            <Loading position="absolute">
              {!!progress && <Progress color="primary.500" size="sm" value={progress} w="60%" borderRadius="2rem" />}
            </Loading>
          )}

          {hover && !loading && (
            <Circle
              position="absolute"
              inset="0"
              bg="black.400"
              w="100%"
              h="100%"
              d="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              fontSize="1.5rem"
              color="white"
              onMouseOut={() => setHover(false)}
              cursor="pointer"
              onClick={() => file.current.click()}
            >
              <input ref={file} type="file" hidden onChange={handleFileChange} />
              <MdPhotoCamera fontSize="3rem" />
              <Text>Click to change photo</Text>
            </Circle>
          )}
          <Image src={imageUrl} alt="avatar" />
        </Circle>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Flex direction="column" gap="1rem">
            <Heading fontSize="1.3rem" textTransform="capitalize">
              firstName
            </Heading>
            <InputField
              errors={errors}
              control={control}
              name="firstName"
              placeholder={t('auth.register.firstNamePlaceholder')}
              py="2rem"
              fontSize="1.5rem"
            />
          </Flex>

          <Flex direction="column" gap="1rem">
            <Heading fontSize="1.3rem" textTransform="capitalize">
              lastName
            </Heading>
            <InputField
              errors={errors}
              control={control}
              name="lastName"
              placeholder={t('auth.register.lastNamePlaceholder')}
              py="2rem"
              fontSize="1.5rem"
            />
          </Flex>
        </Grid>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            email
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="email"
            placeholder={t('auth.register.emailPlaceholder')}
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            username
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="username"
            placeholder="Enter username"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            password
          </Heading>
          <InputGroup size="lg">
            <InputField
              errors={errors}
              control={control}
              name="password"
              placeholder={t('auth.register.pwdPlaceholder')}
              type={show ? 'text' : 'password'}
            />
            <InputRightElement onClick={() => setShow(!show)} top="5%">
              {show ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            confirm password
          </Heading>
          <InputGroup size="lg">
            <InputField
              errors={errors}
              control={control}
              name="confirmPassword"
              placeholder={t('auth.register.confirmPwdPlaceholder')}
              type={show ? 'text' : 'password'}
            />
            <InputRightElement onClick={() => setShow(!show)} top="5%">
              {show ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
            </InputRightElement>
          </InputGroup>
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            phone
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="phone"
            placeholder={t('auth.register.phoneNumberPlaceholder')}
            type="tel"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            position
          </Heading>
          <SelectField
            errors={errors}
            control={control}
            options={_.toPairs(USER_POSITION).map(([key, value]) => ({ value: +key, label: value }))}
            name="position"
            placeholder="Enter a position"
            className="select-field"
            optionLabel="label"
            optionValue="value"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            clinic
          </Heading>
          <SelectField
            errors={errors}
            control={control}
            options={clinicsOpt}
            name="clinicID"
            placeholder="Enter a clinic"
            className="select-field"
            optionLabel="name"
            optionValue="id"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            services
          </Heading>
          <SelectField
            errors={errors}
            control={control}
            options={servicesOpt}
            name="serviceId"
            placeholder="Enter services"
            className="select-field multi-select-field"
            panelClassName="multi-select-field-panel"
            optionLabel="serviceName"
            optionValue="id"
            multiple
            selectedItemTemplate={selectedServicesTemplate}
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            date of birth
          </Heading>
          <CalendarField
            name="dob"
            errors={errors}
            control={control}
            panelClassName={commonCx('user-edit-calendar-panel')}
            inputClassName={commonCx('user-edit-calendar-input')}
            placeholder={t('auth.register.dobPlaceholder')}
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            description
          </Heading>
          <TextareaField
            name="description"
            errors={errors}
            control={control}
            py="1rem"
            fontSize="1.5rem"
            borderColor="grey.300"
            _hover={{}}
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            gender
          </Heading>
          <RadioField name="gender" errors={errors} control={control} />
        </Flex>

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormDentist);
