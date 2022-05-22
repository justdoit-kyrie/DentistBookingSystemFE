import { FiFlag } from 'react-icons/fi';

// path of app routes
export const PATH = {
  home: '/',
  login: '/login',
  register: '/register'
};

// language
export const LANGUAGES = [
  {
    value: 'en',
    label: 'english',
    icon: FiFlag,
    countryCode: 'US'
  },
  {
    value: 'vi',
    label: 'tiếng việt',
    icon: FiFlag,
    countryCode: 'VN'
  }
];

// regex for password
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;
