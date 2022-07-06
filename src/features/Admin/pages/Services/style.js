import styled from 'styled-components';

export const TabViewWrapper = styled.div`
  flex: 1;

  .p-tabview {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .p-tabview-nav {
    border: none !important;
    gap: 1rem;
    justify-content: flex-end;
  }

  .p-tabview-panels {
    padding: 0;
    padding-top: 2rem;
    flex: 1;

    & > * {
      height: 100%;
    }
  }
`;
