import { Button, Circle, Flex, Heading, Image, Progress, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { EMAIL_REGEX, NAME_REGEX, PHONE_REGEX, PWD_REGEX, USER_REGEX } from '~/app/constants';
import { InputField, Loading } from '~/components';
import { withTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import DEFAULT_AVATAR from '~/assets/images/default_avatar.jpg';
import { MdPhotoCamera } from 'react-icons/md';
import { Firebase } from '~/app/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from 'react-toastify';
import moment from 'moment';

// initial validation rules
const schema = yup
  .object({
    gender: yup.string().required('required'),
    username: yup
      .string()
      .required('User name is required')
      .min(5, 'User name must have at least 5 characters')
      .max(30, 'User name must have less than 30 characters')
      .matches(USER_REGEX, 'Please enter a valid user name'),
    password: yup
      .string()
      .required('Password is required')
      .min(12, 'Password is longer than 12 characters')
      .matches(
        PWD_REGEX,
        'Password is at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: yup
      .string()
      .required('Confirm password is required')
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
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

const FormClinic = ({ t, defaultValues, BtnRef }) => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data) => console.log(data);

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

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            name
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="name"
            placeholder={t('auth.register.firstNamePlaceholder')}
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            address
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="address"
            placeholder={t('auth.register.userNamePlaceholder')}
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
            placeholder={t('auth.register.emailPlaceholder')}
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            description
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="description"
            placeholder={t('auth.register.phoneNumberPlaceholder')}
            type="tel"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormClinic);
