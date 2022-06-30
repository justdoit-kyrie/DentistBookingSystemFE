import styled from 'styled-components';
import { dark_mode_color_500, dark_mode_color_600, desc_200, navy_100, primary_500 } from '~/app/styles/variables';

export const DataTableWrapper = styled.div`
  height: 100%;
  position: relative;

  .p-datatable-header,
  .p-datatable-footer,
  .p-datatable-thead > tr > th,
  .users-footer {
    background: ${dark_mode_color_600};
  }

  & .p-datatable-thead > tr > th .p-sortable-column-icon,
  & .p-datatable-thead > tr > th .p-column-title,
  .users-footer * {
    color: white;
  }

  .p-inputtext {
    color: white;
  }

  .p-column-filter-element {
    color: white;
  }

  .users-footer {
    .p-highlight {
      background: ${dark_mode_color_500};
    }

    .p-paginator-page:not(.p-highlight):hover {
      background: ${desc_200};
      color: white;
    }
  }

  & .p-sortable-column {
    &.p-highlight .p-sortable-column-icon {
      color: ${primary_500};
    }

    &:focus {
      box-shadow: none;
    }
  }

  & .p-datatable-tbody > tr {
    background: ${dark_mode_color_600};
  }

  & .p-datatable-tbody > tr.p-selectable-row:not(.p-highlight):not(.p-datatable-emptymessage):hover {
    background: ${dark_mode_color_500} !important;
  }

  & .p-datatable-tbody > tr.p-highlight {
    background: ${dark_mode_color_500} !important;
  }

  & .p-sortable-column:not(.p-sortable-disabled):hover {
    background: ${navy_100};

    & .p-sortable-column-icon {
      color: ${primary_500};
    }
  }
`;
