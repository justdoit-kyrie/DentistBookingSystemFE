import { Avatar, Box, Circle, Flex, Heading, Text } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { BsTwitter } from 'react-icons/bs';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { HOME_BLOCK_NAME, PATH, USER_POSITION } from '~/app/constants';
import { CustomCarousel } from '~/components';
import { FeatureBlock } from '..';
import styles from '../../Home.module.scss';

const cx = classNames.bind(styles);

const Dentist = (props) => {
  const {
    dentist,
    dentists,
    effect,
    renderHeader,
    selectedDentist,
    setSelectedDentist,
    dentistOpts,
    onFilterDropdown,
    panelFooterTemplate
  } = props;

  const navigate = useNavigate();

  const renderDentistList = (dentist) => (
    <Box
      className={cx('carousel-p-1')}
      cursor="pointer"
      onClick={() => navigate(PATH.customer.dentist.replace(':id', dentist.id))}
    >
      <Flex
        borderRadius="12px"
        w="100%"
        align="center"
        direction="column"
        justify="center"
        p="2rem 2rem 3rem"
        border="1px solid grey"
      >
        <Circle size="15rem" overflow="hidden">
          <Avatar src={dentist.imageUrl} className="doctor-avatar" alt="avatar" name={`${dentist.firstName} ${dentist.lastName}`}/>
        </Circle>
        <Flex
          direction="column"
          justify="center"
          align="center"
          fontSize="1.8rem"
          textTransform="capitalize"
          m="2rem 0 2.5rem"
        >
          <Heading variant="medium">{`${dentist.firstName} ${dentist.lastName}`}</Heading>
          <Text fontSize="1.4rem" color="primary.500" mt="1rem">
            {USER_POSITION[dentist.position]}
          </Text>
        </Flex>
        <Text mb="3rem" lineHeight="1.6" fontSize="1.4rem" textAlign="center" color="grey">
          {dentist.description}
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
    </Box>
  );

  return (
    <FeatureBlock id="dentist" header={dentist} effect={effect}>
      <CustomCarousel
        header={renderHeader({
          value: selectedDentist,
          options: dentistOpts,
          optionLabel: 'selectedDentist',
          onChange: (e) => setSelectedDentist(e.value || []),
          onHide: () => onFilterDropdown(HOME_BLOCK_NAME.dentist),
          panelFooterTemplate: () => panelFooterTemplate(HOME_BLOCK_NAME.dentist),
          showClear: true,
          filter: true,
          filterBy: 'firstName,lastName',
          placeholder: 'Enter a dentist name'
        })}
        callback={renderDentistList}
        circular
        value={dentists}
        numVisible={3}
        numScroll={1}
        contentClassName="no-indicators custom-action square pb-2"
      />
    </FeatureBlock>
  );
};

Dentist.propTypes = {
  renderHeader: PropTypes.func.isRequired,
  setSelectedDentist: PropTypes.func.isRequired
};

export default Dentist;
