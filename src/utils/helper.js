import { DefaultLayout } from "components";
import { Fragment } from "react";

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
