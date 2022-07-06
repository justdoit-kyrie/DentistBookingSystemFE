import { AuthLayout, DashboardLayout, NotFound } from '~/components';
import {
  AppointmentPage,
  BlogPage,
  ClinicPage,
  DentistPage,
  HomePage,
  LoginPage,
  MessagePage,
  MyPatientsPage,
  OverViewPage,
  ProfilePage,
  RegisterPage,
  SettingPage
} from '~/features';
import { ClinicsPage, DentistsPage, Overview, ServicesPage, UsersPage } from '~/features/Admin/pages';
import { PATH } from './constants';

//#region routes
/**
 * @param {String} path
 * @param {React Element} component
 * @param {React Element} layout - default is DefaultLayout, if null don't use layout, if false, use layout
 * @param {Boolean} isPublic - if true, the route is public and default it is private
 * @param {Number} role -  0: admin, 1: dentist, 2: customer and default is customer
 */
export const ROUTES = [
  { path: PATH.register, component: RegisterPage, layout: AuthLayout, isPublic: true },
  {
    path: PATH.login,
    component: LoginPage,
    layout: AuthLayout,
    isPublic: true
  },
  {
    path: PATH.notFound,
    component: NotFound,
    isPublic: true,
    layout: null
  },
  {
    path: PATH.customer.home,
    component: HomePage
  },
  {
    path: PATH.customer.dentist,
    component: DentistPage,
    layout: null
  },
  {
    path: PATH.customer.clinic,
    component: ClinicPage,
    isPublic: true,
    layout: null
  },
  { path: PATH.dentist.home, component: OverViewPage, layout: DashboardLayout, role: 1,isPublic: true },
  { path: PATH.dentist.appointment, component: AppointmentPage, layout: DashboardLayout, role: 1 },
  { path: PATH.dentist.blog, component: BlogPage, layout: DashboardLayout, role: 1, isPublic: true },
  { path: PATH.dentist.message, component: MessagePage, layout: DashboardLayout, role: 1, isPublic: true },
  { path: PATH.dentist.myPatients, component: MyPatientsPage, layout: DashboardLayout, role: 1, isPublic: true },
  { path: PATH.dentist.profile, component: ProfilePage, layout: DashboardLayout, role: 1 },
  { path: PATH.dentist.setting, component: SettingPage, layout: DashboardLayout, role: 1, isPublic: true },

  { path: PATH.admin.home, component: Overview, layout: DashboardLayout, role: 0 },
  { path: PATH.admin.user, component: UsersPage, layout: DashboardLayout, role: 0 },
  { path: PATH.admin.dentist, component: DentistsPage, layout: DashboardLayout, role: 0 },
  { path: PATH.admin.clinic, component: ClinicsPage, layout: DashboardLayout, role: 0 },
  { path: PATH.admin.service, component: ServicesPage, layout: DashboardLayout, role: 0, isPublic: true },
  { path: PATH.admin.profile, component: ProfilePage, layout: DashboardLayout, role: 0 }
];
//#endregion
