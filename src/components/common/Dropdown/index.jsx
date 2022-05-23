import Tippy from '@tippyjs/react/headless';
import React from 'react';
import Wrapper from './components/Wrapper';

const DropDown = ({ children, dropdown }) => {
  return (
    <Tippy
      delay={[100, 100]}
      interactive
      placement="bottom"
      render={(attrs) => (
        <Wrapper tabIndex="-1" {...attrs}>
          {dropdown}
        </Wrapper>
      )}
    >
      {children}
    </Tippy>
  );
};

export default DropDown;
