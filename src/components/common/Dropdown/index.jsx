import Tippy from '@tippyjs/react/headless';
import React from 'react';
import Wrapper from './components/Wrapper';

const DropDown = ({ children, dropdown, placement = 'bottom', label, onBack }) => {
  return (
    <Tippy
      delay={[100, 100]}
      interactive
      placement={placement}
      render={(attrs) => (
        <Wrapper label={label} onBack={onBack} tabIndex="-1" {...attrs}>
          {dropdown}
        </Wrapper>
      )}
    >
      {children}
    </Tippy>
  );
};

export default DropDown;
