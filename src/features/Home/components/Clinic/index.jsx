import { Flex, Image, Text } from '@chakra-ui/react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HOME_BLOCK_NAME, PATH } from '~/app/constants';
import { CustomCarousel } from '~/components';
import { FeatureBlock } from '..';
import styles from '../../Home.module.scss';

const cx = classNames.bind(styles);

const Clinic = (props) => {
  const {
    clinic,
    clinics,
    effect,
    renderHeader,
    selectedClinic,
    setSelectedClinic,
    clinicOpts,
    onFilterDropdown,
    panelFooterTemplate
  } = props;
  const navigate = useNavigate();

  const renderClinicList = (clinic) => {
    return (
      <Flex
        direction="column"
        align="flex-start"
        gap="1rem"
        cursor="pointer"
        className={cx('clinic-item', 'carousel-p-1')}
        onClick={() => navigate(PATH.clinic.replace(':id', clinic.id))}
      >
        <Image
          w="100%"
          maxH="50vh"
          objectFit="cover"
          src="https://images.unsplash.com/photo-1648737154547-b0dfd281c51e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
        />
        <Text fontSize="1.6rem">{clinic.name}</Text>
      </Flex>
    );
  };

  return (
    <FeatureBlock id="clinic" header={clinic} effect={effect}>
      <CustomCarousel
        header={renderHeader({
          value: selectedClinic,
          options: clinicOpts,
          optionLabel: 'selectedClinic',
          onChange: (e) => setSelectedClinic(e.value || []),
          onHide: () => onFilterDropdown(HOME_BLOCK_NAME.clinic),
          panelFooterTemplate: () => panelFooterTemplate(HOME_BLOCK_NAME.clinic),
          filter: true,
          showClear: true,
          filterBy: 'name',
          placeholder: 'Enter a clinic name'
        })}
        callback={renderClinicList}
        circular
        value={clinics}
        numVisible={3}
        numScroll={1}
        contentClassName="no-indicators custom-action square"
      />
    </FeatureBlock>
  );
};

Clinic.propTypes = {
  renderHeader: PropTypes.func.isRequired,
  setSelectedClinic: PropTypes.func.isRequired
};

export default Clinic;
