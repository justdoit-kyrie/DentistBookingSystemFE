import { AuthLayout, NotFound } from '~/components';
import { HomePage, LoginPage } from '~/features';
import { PATH } from './constants';

//#region routes
/**
 * @param {String} path
 * @param {React Element} component
 * @param {React Element} layout - default is DefaultLayout, if null don't use layout, if false, use layout
 * @param {Boolean} isPublic - if true, the route is public and default it is private
 */
export const ROUTES = [
  {
    path: PATH.home,
    component: HomePage,
    isPublic: true
  },
  {
    path: PATH.login,
    component: LoginPage,
    layout: AuthLayout
  },
  {
    path: PATH.notFound,
    component: NotFound
  }
];
//#endregion
