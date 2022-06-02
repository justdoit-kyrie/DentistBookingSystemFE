import { Carousel } from 'primereact/carousel';
import PropTypes from 'prop-types';
import React from 'react';

const CustomCarousel = ({ callback = () => {}, ...passProps }) => {
  return <Carousel itemTemplate={callback} {...passProps} />;
};

CustomCarousel.propTypes = {
  callback: PropTypes.func.isRequired
};

export default CustomCarousel;
