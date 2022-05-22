import { DefaultLayout } from 'components';
import { Fragment } from 'react';

//#region routes helper get layout
export const getLayout = (layout) => {
  let Layout = DefaultLayout;

  if (layout) {
    Layout = layout;
  } else if (layout === null) {
    Layout = Fragment;
  }
  return Layout;
};
//#endregion

//#region localStorage helper
export const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
export const getLocalStorageWithoutParse = (key) => localStorage.getItem(key);
export const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
//#endregion
