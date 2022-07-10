import { Box, Button, Flex, Heading, Image, Text, useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { deleteObject, ref } from 'firebase/storage';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Galleria } from 'primereact/galleria';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, PHONE_REGEX } from '~/app/constants';
import { Firebase } from '~/app/firebase';
import { AlertDialog, InputField, TextareaField } from '~/components';
import { selectLoggedUser } from '~/features/Auth/authSlice';
import { DropArea } from './components';

// initial validation rules
const schema = yup
  .object({
    address: yup.string().required('required'),
    phone: yup.string().required('Phone number is required').matches(PHONE_REGEX, 'Please enter a valid phone number'),
    name: yup.string().required('name is required')
  })
  .required();

const effect = {
  btnEffect: {
    root: {
      hidden: {
        opacity: 0
      },
      animate: {
        opacity: 1,
        transition: {
          duration: 0.25,
          staggerChildren: 0.3
        }
      }
    },
    children: {
      hidden: {
        scale: 0,
        opacity: 0
      },
      animate: {
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring'
        }
      }
    }
  }
};

const firebase = new Firebase();
const storage = firebase.getStorage();
const NOW = moment().toISOString();

// eslint-disable-next-line no-unused-vars
const FormClinic = ({ t, defaultValues, BtnRef, loading, setLoading, isEdit, callback }) => {
  const { btnEffect } = effect;
  const userInfo = useSelector(selectLoggedUser);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const itemId = useRef();
  const totalFileUrls = useRef();

  const [activeIndex, setActiveIndex] = useState();
  const [deletedImage, setDeletedImage] = useState();
  const [hover, setHover] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [images, setImages] = useState(defaultValues.imageUrl?.map((item, idx) => ({ url: item, id: idx + 1 })) || []);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    return () => {
      totalFileUrls.current?.length > 0 &&
        totalFileUrls.current.forEach(async (item) => {
          try {
            const storageRef = ref(
              storage,
              `${NOW}_${userInfo.id}/${moment(item.lastModifiedDate).toJSON()}_${item.name}`
            );
            await deleteObject(storageRef);
          } catch (error) {
            toast.error(error.message);
          }
        });
    };
  }, []);

  const handleDeleteImage = (image) => {
    setImages((prev) => prev.filter((item) => item.id !== image.id));
  };

  const itemTemplate = (item) => {
    return (
      <Box
        w="100%"
        onMouseOver={() => setHover(true)}
        onMouseOut={loading ? () => {} : () => setHover(false)}
        position="relative"
      >
        <Image
          src={item.url}
          onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
          w="100%"
          minH="45rem"
          maxH="45rem"
          objectFit="cover"
        />

        {hover && !editingImage && (
          <Flex
            as={motion.div}
            variants={btnEffect.root}
            initial="hidden"
            animate="animate"
            bg="rgba(0,0,0,0.5)"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            zIndex="2"
            justify="center"
            align="center"
          >
            <Flex gap="5rem" justify="space-between" w="50%">
              <Button
                as={motion.button}
                variants={btnEffect.children}
                sx={{
                  '::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '0',
                    w: '0',
                    h: '100%',
                    bg: 'yellow.500',
                    zIndex: '-1'
                  }
                }}
                variant="outline"
                borderColor="yellow.500"
                color="yellow.500"
                fontSize="2rem"
                flex="1"
                p="2rem 0"
                position="relative"
                _hover={{
                  '::before': {
                    w: '100%',
                    transition: 'width 0.5s ease-in-out'
                  },
                  color: 'white'
                }}
                onClick={() => {
                  setEditingImage(true);
                  itemId.current = item.id;
                }}
              >
                <Text as="span" textTransform="capitalize" zIndex="2">
                  Edit
                </Text>
              </Button>
              <Button
                as={motion.button}
                variants={btnEffect.children}
                sx={{
                  '::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '0',
                    w: '0',
                    h: '100%',
                    bg: 'red.200',
                    zIndex: '-1'
                  }
                }}
                variant="outline"
                borderColor="red.200"
                color="red.200"
                fontSize="2rem"
                flex="1"
                p="2rem 0"
                textTransform="capitalize"
                _hover={{
                  '::before': {
                    w: '100%',
                    transition: 'width 0.5s ease-in-out'
                  },
                  color: 'white'
                }}
                onClick={() => {
                  onOpen();
                  setDeletedImage(item);
                }}
              >
                delete
              </Button>
            </Flex>
          </Flex>
        )}

        {editingImage && (
          <DropArea
            loading={loading}
            setLoading={setLoading}
            item={item}
            setEditingImage={setEditingImage}
            setImages={setImages}
            images={images}
            totalFileUrls={totalFileUrls}
            NOW={NOW}
            itemId={itemId}
          />
        )}
      </Box>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <Image
        src={item.url}
        onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
        w="8rem"
        h="6rem"
        objectFit="cover"
      />
    );
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        const { code } = await axios.put(API_ROUTES.clinics, {
          ...data,
          imageUrl: images.map((image) => image.url)
        });

        if (+code === API_CODE.OK) {
          totalFileUrls.current = [];
          if (typeof callback === 'function') callback();
          toast.success('update successfully');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: 'auto' }}>
      {isOpen && (
        <AlertDialog
          onClose={onClose}
          isOpen={isOpen}
          headerContent="Delete Image"
          bodyContent="Are you sure? You can't undo this action afterwards."
          handleDelete={() => handleDeleteImage(deletedImage)}
        />
      )}

      <Flex direction="column" gap="3rem" h="auto" pt="2rem" pb="5rem">
        {images.length === 0 ? (
          <DropArea
            loading={loading}
            setLoading={setLoading}
            item={0}
            setEditingImage={setEditingImage}
            setImages={setImages}
            images={images}
            totalFileUrls={totalFileUrls}
            NOW={NOW}
            itemId={itemId}
            position="relative"
          />
        ) : (
          <Galleria
            value={images}
            numVisible={5}
            item={itemTemplate}
            thumbnail={thumbnailTemplate}
            activeIndex={activeIndex}
            onItemChange={(e) => {
              setEditingImage(false);
              setActiveIndex(e.index);
            }}
          />
        )}

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            name
          </Heading>
          <InputField
            errors={errors}
            control={control}
            name="name"
            placeholder="Enter Name"
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
            placeholder="Enter Address"
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
            placeholder="Enter Phone Number"
            py="2rem"
            fontSize="1.5rem"
          />
        </Flex>

        <Flex direction="column" gap="1rem">
          <Heading fontSize="1.3rem" textTransform="capitalize">
            description
          </Heading>
          <TextareaField
            errors={errors}
            control={control}
            name="description"
            placeholder="Enter Description"
            py="1rem"
            fontSize="1.5rem"
            borderColor="grey.300"
          />
        </Flex>

        <Button ref={BtnRef} type="submit" display="none" />
      </Flex>
    </form>
  );
};

export default withTranslation()(FormClinic);
