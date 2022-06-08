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
    myPatients: '/dashboard/:id/myPatients',
    message: '/dashboard/:id/message',
    blog: '/dashboard/:id/blog',
    profile: '/dashboard/:id/profile',
    setting: '/dashboard/:id/setting'
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
  'yyyy-MM-DD': 'yyyy-MM-DD'
};

// api routes
export const API_ROUTES = {
  login: '/Users/authenticate',
  register: '/Users/register',
  logout: '/logout',
  refreshToken: '/Users/refresh',
  'get-clinics': '/clinics',
  'get-dentists': '/dentists',
  'get-profile': '/Users/getProfile'
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
