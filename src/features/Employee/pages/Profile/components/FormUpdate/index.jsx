import { Button, Circle, Flex, Grid, Heading, Progress, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { motion } from 'framer-motion';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { MdPhotoCamera } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, DATE_FORMAT, EMAIL_REGEX, NAME_REGEX, PHONE_REGEX } from '~/app/constants';
import { Firebase } from '~/app/firebase';
import DEFAULT_AVATAR from '~/assets/images/default_avatar.jpg';
import { CalendarField, FormFieldWrapper, InputField, Loading, RadioField } from '~/components';
import { selectLoggedUser, updateLoggedUser } from '~/features/Auth/authSlice';

// initial validation rules
const schema = yup
  .object({
    gender: yup.string().required('Gender is required'),
    email: yup.string().required('Email is required').matches(EMAIL_REGEX, 'Please enter a valid email address'),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .matches(PHONE_REGEX, 'Please enter a valid phone number'),
    firstName: yup.string().required('First name is required').matches(NAME_REGEX, 'Please enter a valid first name'),
    lastName: yup.string().required('Last name is required').matches(NAME_REGEX, 'Please enter a valid last name'),
    dob: yup.string().required('Please select date of birth')
  })
  .required();

const firebase = new Firebase();
const storage = firebase.getStorage();

const FormUpdate = ({ t, initialValue }) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialValue,
    resolver: yupResolver(schema)
  });
  const dispatch = useDispatch();

  const userInfo = useSelector(selectLoggedUser);

  const [hover, setHover] = useState(false);
  const [imageUrl, setImageUrl] = useState(userInfo.imageUrl);
  const [prevImage, setPrevImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const file = useRef();

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(API_ROUTES.users, {
        ...data,
        userId: userInfo.id,
        gender: +data.gender,
        dob: moment(data.dob).format(DATE_FORMAT['YYYY-MM-DD']),
        imageUrl: imageUrl ? imageUrl : undefined,
        phone: data.phoneNumber
      });
      if (+res.code === API_CODE.OK) {
        dispatch(updateLoggedUser({ ...data, imageUrl, dob: moment(data.dob).format(DATE_FORMAT['YYYY-MM-DD']) }));
        toast.success(res.message);
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
        const storageRef = ref(storage, `${userInfo.id}_${moment(file.lastModifiedDate).toJSON()}_${file.name}`);
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
                setLoading(true);
                setProgress(progress);
                break;
            }
          },
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setLoading(false);
              setHover(false);
              setImageUrl(downloadURL);
              setPrevImage(`${userInfo.id}_${moment(file.lastModifiedDate).toJSON()}_${file.name}`);
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
    <>
      <Circle
        position="relative"
        size="20rem"
        boxShadow="0 0 0 5px #bababa"
        bg={`url('${imageUrl ? imageUrl : DEFAULT_AVATAR}') no-repeat center center`}
        bgSize="cover"
        onMouseOver={() => setHover(true)}
        onError={(e) => (e.backgroundImage = `url('${DEFAULT_AVATAR}')`)}
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
      </Circle>

      <form onSubmit={handleSubmit(onSubmit)} style={{ flex: 1 }}>
        <Flex direction="column" gap="2rem">
          <Heading color="primary.400" textTransform="capitalize" variant="bold" fontSize="2rem" mb="2rem">
            Account details
          </Heading>

          <Grid templateColumns="repeat(2, 1fr)" gap="2rem">
            <FormFieldWrapper label="first name">
              <InputField
                errors={errors}
                control={control}
                name="firstName"
                placeholder={t('auth.register.firstNamePlaceholder')}
                fontSize="1.5rem"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="last Name">
              <InputField
                errors={errors}
                control={control}
                name="lastName"
                placeholder={t('auth.register.lastNamePlaceholder')}
                fontSize="1.5rem"
              />
            </FormFieldWrapper>
          </Grid>

          <FormFieldWrapper label="email">
            <InputField
              errors={errors}
              control={control}
              name="email"
              placeholder={t('auth.register.emailPlaceholder')}
              fontSize="1.5rem"
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="phone number">
            <InputField
              errors={errors}
              control={control}
              name="phoneNumber"
              placeholder={t('auth.register.phoneNumberPlaceholder')}
              type="tel"
              fontSize="1.5rem"
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="date of birth">
            <CalendarField
              name="dob"
              errors={errors}
              control={control}
              panelClassName="override-panel"
              placeholder={t('auth.register.dobPlaceholder')}
            />
          </FormFieldWrapper>

          <RadioField name="gender" errors={errors} control={control} />

          <Button
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            size="full"
            variant="primary"
            textTransform="capitalize"
            borderRadius="1rem"
            color="white"
            fontSize="1.6rem"
            mt="1rem"
          >
            save new changes
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default withTranslation()(FormUpdate);
