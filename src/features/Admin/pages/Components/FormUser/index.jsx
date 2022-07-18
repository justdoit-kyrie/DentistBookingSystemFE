import { Button, Circle, Flex, Grid, Heading, Image, Progress, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { MdPhotoCamera } from 'react-icons/md';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, DATE_FORMAT, EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from '~/app/constants';
import { Firebase } from '~/app/firebase';
import DEFAULT_AVATAR from '~/assets/images/default_avatar.jpg';
import { CalendarField, InputField, Loading, RadioField } from '~/components';
import styles from '../styles/common.module.scss';
const cx = classNames.bind(styles);

// initial validation rules
const schema = yup
  .object({
    gender: yup.string().required('required'),
    email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
    phone: yup.string().required('Phone number is required').matches(PHONE_REGEX, 'Please enter a valid phone number'),
    firstName: yup.string().required('First name is required').matches(NAME_REGEX, 'Please enter a valid first name'),
    lastName: yup.string().required('Last name is required').matches(NAME_REGEX, 'Please enter a valid last name'),
    dob: yup
      .date()
      .max(moment().subtract(1, 'days').toDate(), 'date of birth must be at earlier than now')
      .required('Please select date of birth')
  })
  .required();

const firebase = new Firebase();
const storage = firebase.getStorage();

const FormUser = ({ t, onClose, BtnRef, defaultValues, callback, loading, setLoading }) => {
  const [hover, setHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prevImage, setPrevImage] = useState('');
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl || DEFAULT_AVATAR);

  const file = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const { code, message } = await axios.put(API_ROUTES.users, {
        ...data,
        gender: +data.gender,
        dob: moment(data.dob).format(DATE_FORMAT['YYYY-MM-DD']),
        imageUrl: imageUrl ? imageUrl : undefined
      });
      if (+code === API_CODE.OK) {
        toast.success(message);
        if (typeof callback === 'function') callback();
        onClose();
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
      <Flex direction="column" gap="2rem" h="auto" pt="2rem" pb="5rem">
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
            date of birth
          </Heading>
          <CalendarField
            name="dob"
            errors={errors}
            control={control}
            panelClassName={cx('user-edit-calendar-panel')}
            inputClassName={cx('user-edit-calendar-input')}
            placeholder={t('auth.register.dobPlaceholder')}
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            gender
          </Heading>
          <RadioField name="gender" errors={errors} control={control} />
        </Flex>

        <Button type="submit" ref={BtnRef} display="none">
          submit
        </Button>
      </Flex>
    </form>
  );
};

export default withTranslation()(FormUser);
