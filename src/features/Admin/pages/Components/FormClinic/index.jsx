import { Box, Button, Flex, Heading, Image, Square, Text, useDisclosure } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { motion } from 'framer-motion';
import moment from 'moment';
import { Galleria } from 'primereact/galleria';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { axios } from '~/apis';
import { API_CODE, API_ROUTES, PHONE_REGEX } from '~/app/constants';
import { Firebase } from '~/app/firebase';
import { AlertDialog, InputField, Loading, TextareaField } from '~/components';
import { selectLoggedUser } from '~/features/Auth/authSlice';

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

// [
//   {
//     url: 'https://images.unsplash.com/photo-1655915382353-8f89f9bbdb03?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
//     id: 1
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1655949595981-f1d8e8739cdf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyN3x8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
//     id: 2
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1655939270516-42b8fbd258c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
//     id: 3
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1655839799605-7dae9640735a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
//     id: 4
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1655917218336-538bc2ab1775?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyOHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
//     id: 5
//   },
//   {
//     url: 'https://images.unsplash.com/photo-1655666002284-096ecc672528?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1N3x8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
//     id: 6
//   }
// ]

const firebase = new Firebase();
const storage = firebase.getStorage();
const NOW = moment().toISOString();

// eslint-disable-next-line no-unused-vars
const FormClinic = ({ t, defaultValues, BtnRef, loading, setLoading, isEdit }) => {
  const { btnEffect } = effect;
  const userInfo = useSelector(selectLoggedUser);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getRootProps, getInputProps, fileRejections, open, isFocused, isDragAccept, isDragReject } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const previews = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      );
      setItemHoverId(itemId.current);
      setFiles([...previews]);
      setFilesPreview([...previews]);
      setFileUrls([]);
    }
  });

  const itemId = useRef();
  const totalFileUrls = useRef();

  const [files, setFiles] = useState([]);
  const [filesPreview, setFilesPreview] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [deletedImage, setDeletedImage] = useState();
  const [itemHoverId, setItemHoverId] = useState();
  const [hover, setHover] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [images, setImages] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    setImages(defaultValues.imageUrl?.map((item, idx) => ({ url: item, id: idx + 1 })));

    return () =>
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
  }, []);

  useEffect(() => {
    return () =>
      filesPreview.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
  }, [filesPreview]);

  useEffect(() => {
    if (fileUrls.length === files.length && fileUrls.length !== 0) {
      const lastIdx = [...images].pop().id;
      const unique = fileUrls.map((url, idx) => ({ url, id: lastIdx + idx + 1 }));
      setFiles([]);
      setImages((prev) => [...prev.filter((v) => v.id !== itemHoverId), ...unique]);
    }
  }, [fileUrls]);

  const getBorderColor = () => {
    if (isFocused || isDragAccept) return 'primary.500';
    if (isDragReject) return 'red.200';
    return 'primary.200';
  };

  const handleDeleteImage = (image) => {
    setImages((prev) => prev.filter((item) => item.id !== image.id));
  };

  console.log({ images });

  const handleEditImage = async () => {
    try {
      files.forEach(async (item, idx) => {
        URL.revokeObjectURL(item.preview);
        const storageRef = ref(storage, `${NOW}_${userInfo.id}/${moment(item.lastModifiedDate).toJSON()}_${item.name}`);
        const uploadTask = uploadBytesResumable(storageRef, item);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            switch (snapshot.state) {
              case 'paused':
                toast.warning('Upload is paused');
                break;
              case 'running':
                setLoading(true);
                break;
            }
          },
          (error) => {
            toast.error(error.message);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              if (idx === files.length - 1) {
                setLoading(false);
                setHover(false);
              }
              setFileUrls((prev) => [...prev, downloadURL]);
            });
          }
        );
      });

      totalFileUrls.current =
        typeof totalFileUrls.current === 'undefined' ? [...files] : [...totalFileUrls.current, ...files];
      setEditingImage(false);
    } catch (error) {
      toast.error(error.message);
    }
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

        {loading && <Loading position="absolute" />}

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
                onClick={() => setEditingImage(true)}
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

        {hover && editingImage && (
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
            <Flex
              direction="column"
              w="100%"
              h="100%"
              align="center"
              justify="center"
              pt="2rem"
              pb="1rem"
              gap="1rem"
              bg="purple.300"
            >
              <Flex
                flex="1"
                direction="column"
                align="center"
                justify="center"
                gap="2rem"
                border={isDragAccept || isDragReject || isFocused ? '2px solid' : '2px dashed'}
                borderColor={getBorderColor()}
                borderRadius="1.2rem"
                w="100%"
                h="100%"
                maxW="90%"
                maxH="90%"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {fileRejections.length > 0 && (
                  <Text color="yellow.400" textAlign="center" fontSize="1.5rem" maxW="80%">
                    <Text as="span" fontWeight="400">
                      Only files with the following extensions are allowed:{' '}
                    </Text>
                    <Text as="span" fontWeight="650">
                      png, jpg, jpeg, gif, tiff,...
                    </Text>
                  </Text>
                )}
                <Flex direction="column" align="center" justify="center">
                  <FaCloudUploadAlt color="white" fontSize="10rem" />
                  <Text color="white" fontSize="2.5rem" lineHeight="1" mt="1.5rem">
                    {isDragAccept ? 'Release to Upload File' : 'Drag & Drop to Upload File'}
                  </Text>
                  <Text color="white" fontSize="1.5rem" lineHeight="1" textTransform="uppercase" mt="1rem">
                    or
                  </Text>
                </Flex>
                {files.length > 0 && item.id === itemHoverId ? (
                  <Flex gap="2rem">
                    <Button
                      as={motion.div}
                      whileHover={{ scale: 0.9 }}
                      whileTap={{ scale: 1.1 }}
                      fontSize="1.6rem"
                      bg="primary.500"
                      color="white"
                      p="2rem 0"
                      w="10rem"
                      onClick={handleEditImage}
                      _hover={{}}
                      _active={{}}
                    >
                      Save
                    </Button>
                    <Button
                      as={motion.div}
                      whileHover={{ scale: 0.9 }}
                      whileTap={{ scale: 1.1 }}
                      fontSize="1.6rem"
                      bg="red.200"
                      color="white"
                      p="2rem 0"
                      w="10rem"
                      onClick={() => {
                        files.forEach((file) => URL.revokeObjectURL(file.preview));
                        setFiles([]);
                        setEditingImage(false);
                      }}
                      _hover={{}}
                      _active={{}}
                    >
                      Cancel
                    </Button>
                  </Flex>
                ) : (
                  <Button
                    fontSize="1.6rem"
                    bg="white"
                    p="2rem 0"
                    w="10rem"
                    onClick={() => {
                      open();
                      itemId.current = item.id;
                    }}
                  >
                    Browse
                  </Button>
                )}
              </Flex>

              <Flex gap="1rem" overflowX="auto" maxW="90%" className="hide-scrollbar">
                {item.id === itemHoverId &&
                  files.map((file, index) => (
                    <Square
                      size="10rem"
                      key={`${index}`}
                      border="2px solid"
                      borderColor="white"
                      borderRadius="1.2rem"
                      overflow="hidden"
                    >
                      <Image w="100%" h="100%" objectFit="cover" src={file.preview} />
                    </Square>
                  ))}
              </Flex>
            </Flex>
          </Flex>
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
        <Galleria value={images} numVisible={5} item={itemTemplate} thumbnail={thumbnailTemplate} />

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
          <TextareaField
            errors={errors}
            control={control}
            name="description"
            placeholder={t('auth.register.phoneNumberPlaceholder')}
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
