/* eslint-disable no-unused-vars */
import { Box, Circle, Flex, Heading, Image, Link, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { DataView } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import React, { useEffect, useState } from 'react';
import { BsTwitter } from 'react-icons/bs';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { axios } from '~/apis';
import { API_ROUTES, USER_POSITION } from '~/app/constants';
import TitleBlock from '../TitleBlock';
import './Dentist.scss';

const sortOptions = [
  { label: 'Price High to Low', value: '!price' },
  { label: 'Price Low to High', value: 'price' }
];

const Dentist = ({ dentist }) => {
  const { title, desc } = dentist;
  const [pagination, setPagination] = useState(null);
  const [dentists, setDentists] = useState([]);
  const [first, setFirst] = useState(0);

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);

  useEffect(() => {
    (async () => {
      const { content, pagination } = await axios.get(API_ROUTES['get-dentists']);
      if (pagination) setPagination(pagination);
      if (content?.length > 0) setDentists(content);
    })();
  }, []);

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const onPage = async (event) => {
    try {
      const page = event.page + 1;
      const { content } = await axios.get(`${API_ROUTES['get-dentists']}?PageNumber=${page}`);

      setFirst(event.first);
      setDentists(content);
    } catch (error) {
      toast.error(error.message);
    }
  };

  console.log({ dentists });

  // eslint-disable-next-line no-unused-vars
  const renderDentistList = (item) => (
    <Flex
      borderRadius="12px"
      w="100%"
      align="center"
      direction="column"
      justify="center"
      boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      p="2rem 2rem 3rem"
      _hover={{ boxShadow: '0px 3px 66px -24px rgb(0 0 0 / 50%)' }}
    >
      <Circle size="15rem" overflow="hidden">
        <Image src={item.avatar} alt="avatar" />
      </Circle>
      <Flex
        direction="column"
        justify="center"
        align="center"
        fontSize="1.8rem"
        textTransform="capitalize"
        m="2rem 0 2.5rem"
      >
        <Heading fontWeight="500">{`${item.firstName} ${item.lastName}`}</Heading>
        <Text fontSize="1.4rem" color="primary.500" mt="1rem">
          {USER_POSITION[item.position]}
        </Text>
      </Flex>
      <Text mb="3rem" lineHeight="1.6" fontSize="1.4rem" textAlign="center" color="grey">
        {item.description}
      </Text>
      <Flex justify="space-evenly" color="primary.500" w="100%" maxW="60%" fontSize="1.6rem">
        <Link to="#" target="_blank">
          <BsTwitter color="inherit" />
        </Link>
        <Link to="#" target="_blank">
          <FaFacebookF color="inherit" />
        </Link>
        <Link to="#" target="_blank">
          <FaInstagram color="inherit" />
        </Link>
        <Link to="#" target="_blank">
          <FaTiktok color="inherit" />
        </Link>
      </Flex>
    </Flex>
  );

  const renderHeader = () => {
    return <Flex>header</Flex>;
  };

  const renderFooter = () => {
    return (
      <Paginator
        first={first}
        rows={pagination.pageSize}
        totalRecords={pagination.totalRecords}
        onPageChange={onPage}
      />
    );
  };

  return (
    <Box mt="7rem" className="container">
      <TitleBlock title={title} desc={desc} fontSize="1.5rem" maxW="50%" m="0 auto" textAlign="center" />
      <Box mt="10rem" as={motion.div}>
        {pagination && (
          <DataView
            layout="grid"
            value={dentists}
            header={renderHeader()}
            footer={renderFooter()}
            itemTemplate={(dentist) => renderDentistList(dentist)}
            emptyMessage="no data found"
          />
        )}
      </Box>
    </Box>
  );
};

export default Dentist;
