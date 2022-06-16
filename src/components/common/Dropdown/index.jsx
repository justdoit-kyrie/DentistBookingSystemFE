import { Flex, Text, useColorMode } from '@chakra-ui/react';
import Tippy from '@tippyjs/react/headless';
import _ from 'lodash';
import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LANGUAGE_KEY } from '~/app/constants';
import { getLocalStorageWithoutParse } from '~/utils';
import Wrapper from './components/Wrapper';

const DropDown = ({ t, items = [], children, dropdown, placement = 'bottom', bg = 'white', offset = [0, 10] }) => {
  const [history, setHistory] = useState([{ data: items }]);
  const { colorMode } = useColorMode();
  const current = history[history.length - 1];

  const language = getLocalStorageWithoutParse(LANGUAGE_KEY);

  const handleBack = () => setHistory((prev) => prev.slice(0, prev.length - 1));

  const handleHidden = () => setHistory([{ data: items }]);

  const handleChangeMenu = (children, callback) => {
    if (typeof callback == 'function') {
      callback();
    }

    const isParent = !!children;
    if (isParent) {
      setHistory((prev) => [...prev, children]);
    }
  };

  const handleMenuHoverColor = (code) => {
    if (code === language) return {};
    return { bg: 'grey.100' };
  };

  const handleBackground = (code, value) => {
    switch (code) {
      case 'colorMode':
        return value === colorMode ? 'grey.100' : '';
      default:
        return value === language ? 'grey.100' : '';
    }
  };

  const renderDropdownItem = () => {
    let unique;
    const activeItem = current.data.find((v) => v.code === language);
    if (activeItem) {
      unique = _.union([activeItem], current.data);
    } else {
      unique = current.data;
    }
    return unique.map(({ code, label, icon, children, isBorder = false, fw = 700, to = false, onClick, bg }, index) => {
      const Icon = icon ? icon : Fragment;
      const Comp = to ? Link : Fragment;
      const compProps = {};
      const iconProps = {};
      if (to) {
        compProps.to = to;
      }
      if (icon) {
        iconProps.w = '2rem';
        iconProps.h = '2rem';
        iconProps.fontSize = '1.75rem';
      }

      return (
        <Comp key={`language - ${index}`} {...compProps}>
          <Flex
            align="center"
            gap="1rem"
            p="1rem"
            cursor="pointer"
            _hover={handleMenuHoverColor(code)}
            bg={() => handleBackground(bg, code)}
            borderTop={isBorder && '1px solid'}
            borderColor={isBorder && 'grey.100'}
            fontSize="1.5rem"
            onClick={() => handleChangeMenu(children, onClick)}
            color="black"
          >
            <Icon {...iconProps} />
            <Text fontWeight={fw} textTransform="capitalize">
              {t(`common.dropdown.${label}`)}
            </Text>
          </Flex>
        </Comp>
      );
    });
  };

  return (
    <Tippy
      delay={[100, 100]}
      interactive
      placement={placement}
      render={(attrs) => (
        <Wrapper label={history.length > 1 ? current.label : ''} onBack={handleBack} tabIndex="-1" bg={bg} {...attrs}>
          {dropdown ? dropdown : renderDropdownItem()}
        </Wrapper>
      )}
      onHidden={handleHidden}
      offset={offset}
    >
      {children}
    </Tippy>
  );
};

export default withTranslation()(DropDown);
