import Tippy from '@tippyjs/react/headless';
import React from 'react';
import Wrapper from './components/Wrapper';

const DropDown = ({ children, dropdown, placement = 'bottom', label, onBack, onHidden, bg = 'white' }) => {
  return (
    <Tippy
      delay={[100, 100]}
      interactive
      placement={placement}
      render={(attrs) => (
        <Wrapper label={label} onBack={onBack} tabIndex="-1" bg={bg} {...attrs}>
          {dropdown}
        </Wrapper>
      )}
      onHidden={onHidden}
    >
      {children}
    </Tippy>
  );
};

export default DropDown;
