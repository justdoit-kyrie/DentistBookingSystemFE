import styled from 'styled-components';
import { focus_text_field, invalid_text_field_color } from '~/app/styles';

export const Wrapper = styled.div`
  & > div {
    &:not(.p-disabled).p-focus {
      box-shadow: 0 0 0 1px ${focus_text_field};
      border-color: ${focus_text_field};
    }

    &.${(props) => props.className} {
      &:not(.p-disabled) {
        box-shadow: none;
        &.p-focus {
          &:hover {
            border-color: ${focus_text_field};
            box-shadow: none;
          }
        }

        &:hover {
          border-color: ${invalid_text_field_color};
        }
      }
    }
  }
`;
