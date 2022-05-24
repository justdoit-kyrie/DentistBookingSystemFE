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
    countryCode: 'US'
  },
  {
    value: 'vi',
    label: 'tiếng việt',
    countryCode: 'VN'
  }
];

// regex for password
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;
