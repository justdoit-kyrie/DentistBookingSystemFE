import { Carousel } from 'primereact/carousel';
import PropTypes from 'prop-types';
import React from 'react';

const CustomCarousel = ({
  callback = () => {},
  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ],
  ...passProps
}) => {
  // -items-container
  return (
    <Carousel
      responsiveOptions={responsiveOptions}
      itemTemplate={callback}
      contentClassName="custom-carousel"
      {...passProps}
    />
  );
};

CustomCarousel.propTypes = {
  callback: PropTypes.func.isRequired
};

export default CustomCarousel;
