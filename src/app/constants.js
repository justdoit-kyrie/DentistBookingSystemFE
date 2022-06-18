import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { BsFacebook, BsGithub } from 'react-icons/bs';
import { createBrowserHistory } from 'history';

// local storage key
export const LANGUAGE_KEY = 'i18nextLng';
export const AUTH_KEY = 'auth';

// colors
export const COLORS = {
  black: {
    50: 'rgba(0,0,0,0.1)',
    100: 'rgba(0,0,0,0.27)'
  },
  primary: {
    100: '#F5F2EA',
    200: '#3182ce',
    400: '#93B4FB'
  },
  red: { 500: '#DA7374' }
};

// path of app routes
export const PATH = {
  login: '/login',
  notFound: '*',
  register: '/register',
  customer: {
    home: '/',
    clinic: '/clinic/:id',
    dentist: '/dentist/:id'
  },
  dentist: {
    home: '/dashboard/:id/overview',
    appointment: '/dashboard/:id/appointment',
    profile: '/dashboard/:id/profile'
  },
  admin: {
    home: '/dashboard/:id/overview',
    user: '/dashboard/:id/users',
    dentist: '/dashboard/:id/dentists',
    clinic: '/dashboard/:id/clinics',
    service: '/dashboard/:id/services',
    profile: '/dashboard/:id/profile'
  }
};

// language
export const LANGUAGES = [
  {
    value: 'en',
    label: 'english',
    countryCode: 'US'
  },
  {
    value: 'vi',
    label: 'tiếng việt',
    countryCode: 'VN'
  }
];

export const ORTHERS_LOGIN_METHOD = [
  {
    value: 'google',
    icon: { value: FcGoogle },
    provider: new GoogleAuthProvider()
  },
  {
    value: 'facebook',
    icon: { value: BsFacebook, lightColor: 'blue', darkColor: COLORS.primary[200] },
    provider: new FacebookAuthProvider()
  },
  {
    value: 'github',
    icon: { value: BsGithub },
    provider: new GithubAuthProvider()
  }
];

// regex for password
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;

// regex for email
export const EMAIL_REGEX = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

// regex for phone number
export const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

// regex for user name
export const USER_REGEX = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;

// regex for first & last name
export const NAME_REGEX = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

// regex for date
export const DATE_FORMAT = {
  'yyyy-MM-DD': 'yyyy-MM-DD',
  'DD-MM-YYYY': 'DD-MM-YYYY',
  'YYYY-MM-DD': 'YYYY-MM-DD',
  'dd/mm/yy': 'dd/mm/yy',
  'DD/MM/YYYY': 'DD/MM/YYYY'
};

// api routes
export const API_ROUTES = {
  login: '/Users/authenticate',
  register: '/Users/register',
  logout: '/logout',
  refreshToken: '/Users/refresh',
  'get-clinics': '/clinics',
  'get-dentists': '/dentists',
  'get-profile': '/Users/getProfile',
  'get-booking-by-dentist-it': '/bookings/dentist/:id',
  users: '/Users'
};

// api status code
export const API_CODE = {
  expiredToken: 901,
  invalidToken: 900,
  OK: 200,
  failed: 400
};

// history of react router
export const history = createBrowserHistory();

// sexual
export const USER_SEXUAL = {
  0: 'male',
  1: 'female'
};

// position
export const USER_POSITION = {
  0: 'head',
  1: 'dentist',
  2: 'assistant'
};

// home-block-name
export const HOME_BLOCK_NAME = {
  dentist: 'dentist',
  clinic: 'clinic'
};

// system role
export const ROLE = {
  0: 'admin',
  1: 'docter',
  2: 'user'
};

// schedule timer
export const SCHEDULE_TIMER = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00'
];

// week
export const SCHEDULE_WEEK = (t) => ({
  0: t('dashboard.dentist.appointment.table-header.sunday'),
  1: t('dashboard.dentist.appointment.table-header.monday'),
  2: t('dashboard.dentist.appointment.table-header.tuesday'),
  3: t('dashboard.dentist.appointment.table-header.wednesday'),
  4: t('dashboard.dentist.appointment.table-header.thursday'),
  5: t('dashboard.dentist.appointment.table-header.friday'),
  6: t('dashboard.dentist.appointment.table-header.saturday')
});

export const MONTH = (t) => ({
  0: t('common.month.january'),
  1: t('common.month.february'),
  2: t('common.month.march'),
  3: t('common.month.april'),
  4: t('common.month.may'),
  5: t('common.month.june'),
  6: t('common.month.july'),
  7: t('common.month.august'),
  8: t('common.month.september'),
  9: t('common.month.octopus'),
  10: t('common.month.november'),
  11: t('common.month.december')
});

export const STATUS_CODE = {
  0: 'active',
  1: 'inActive',
  2: 'pending',
  3: 'confirmed',
  4: 'done',
  5: 'declined'
};

export const BOOKING_STATUS = (t) => [
  {
    label: t('dashboard.dentist.appointment.table-footer.pending'),
    value: 'active',
    color: 'green'
  },
  {
    label: t('dashboard.dentist.appointment.table-footer.pending'),
    value: 'inactive',
    color: 'red'
  },
  {
    label: t('dashboard.dentist.appointment.table-footer.pending'),
    value: 'pending',
    color: '#ffa901' //yellow.500
  },
  {
    label: t('dashboard.dentist.appointment.table-footer.ongoing'),
    value: 'ongoing',
    color: '#7a6efe' //purple.500
  },
  {
    label: t('dashboard.dentist.appointment.table-footer.success'),
    value: 'success',
    color: 'green'
  }
];
