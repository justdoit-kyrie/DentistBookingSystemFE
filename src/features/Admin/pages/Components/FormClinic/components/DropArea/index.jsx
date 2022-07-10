import { Button, Flex, Image, Square, Text } from '@chakra-ui/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { motion } from 'framer-motion';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Firebase } from '~/app/firebase';
import { Loading } from '~/components';
import { selectLoggedUser } from '~/features/Auth/authSlice';

const effect = {
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
};

const firebase = new Firebase();
const storage = firebase.getStorage();

const DropArea = ({
  loading,
  setLoading,
  item,
  setEditingImage,
  setImages,
  images,
  totalFileUrls,
  NOW,
  itemId,
  position = 'absolute'
}) => {
  const userInfo = useSelector(selectLoggedUser);
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

  const [files, setFiles] = useState([]);
  const [filesPreview, setFilesPreview] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);
  const [itemHoverId, setItemHoverId] = useState();

  useEffect(() => {
    return () =>
      filesPreview.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
  }, [filesPreview]);

  useEffect(() => {
    if (fileUrls.length === files.length && fileUrls.length !== 0) {
      const lastIdx = [...images].pop()?.id || 0;
      const unique = fileUrls.map((url, idx) => ({ url, id: lastIdx + idx + 1 }));
      setFiles([]);
      setImages((prev) => [...prev.filter((v) => v.id !== itemHoverId), ...unique]);
      setEditingImage(false);
    }
  }, [fileUrls]);

  const getBorderColor = () => {
    if (isFocused || isDragAccept) return 'primary.500';
    if (isDragReject) return 'red.200';
    return 'primary.200';
  };

  const handleEditImage = async () => {
    try {
      let idx = 0;
      files.forEach(async (item) => {
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
              }
              idx++;
              setFileUrls((prev) => [...prev, downloadURL]);
            });
          }
        );
      });

      totalFileUrls.current =
        typeof totalFileUrls.current === 'undefined' ? [...files] : [...totalFileUrls.current, ...files];
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Flex
      as={motion.div}
      variants={effect.root}
      initial="hidden"
      animate="animate"
      bg="rgba(0,0,0,0.5)"
      position={position}
      inset="0"
      w="100%"
      h="100%"
      zIndex="2"
      justify="center"
      align="center"
    >
      {loading && <Loading position="absolute" />}
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
        minH="45rem"
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
                // itemId.current = item.id;
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
  );
};

export default DropArea;
