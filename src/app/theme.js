const { extendTheme } = require('@chakra-ui/react');

// mode
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

export const theme = extendTheme({
  config,
  colors: {
    white: {
      200: 'rgba(255,255,255, 0.5)'
    },
    black: {
      100: 'rgba(255, 255, 255, 0.05)',
      200: 'rgba(0, 0, 0, 0.05)',
      400: 'rgba(0, 0, 0, 0.27)',
      500: '#191919'
    },
    purple: {
      400: '#a399f6',
      500: '#7a6efe'
    },
    yellow: {
      500: '#ffa901'
    },
    F: {
      100: '#feeeee',
      200: '#ff5363'
    },
    grey: {
      50: '#f5f5f5',
      70: '#808080',
      100: '#efefef',
      200: '#bababa',
      300: '#5F5D5B',
      400: '#6e6868',
      500: '#3C3C3C'
    },
    primary: {
      100: '#F5F2EA',
      200: '#2cafcb',
      250: '#e9f6fe',
      300: '#24a8fa',
      400: '#93B4FB',
      500: '#2f89fc'
    },
    navy: {
      100: '#788daa',
      500: '#3a486e'
    },
    desc: {
      300: 'rgba(255, 255, 255, 0.3)',
      500: 'rgba(255, 255, 255, 0.8)'
    },
    linearGradient: {
      100: 'linear-gradient(200deg, #2f89fc 0%, #2cbcbc 100%)'
    },
    dark: {
      500: '#2c3650',
      600: '#232b3e',
      650: '#2d3748',
      700: '#1a202c'
    }
  },
  styles: {
    global: {
      '*,*:before,*:after': {
        m: 0,
        p: 0,
        boxSizing: 'border-box'
      },

      html: {
        fontSize: '62.5%',
        scrollBehavior: 'smooth',
        scrollPaddingTop: '2rem'
      },

      body: {
        letterSpacing: '0.1rem',
        overflowX: 'hidden',
        // eslint-disable-next-line quotes
        fontFamily: `'IBM Plex Sans',ProximaNova,Arial,Tahoma,PingFangSC,sans-serif`
      },

      'button, textarea, input, select, a, .p-inputtext': {
        // eslint-disable-next-line quotes
        fontFamily: `'IBM Plex Sans',ProximaNova,Arial,Tahoma,PingFangSC,sans-serif`
      },

      a: {
        color: 'currentColor',
        textDecoration: 'none'
      },

      img: {
        maxWidth: '100%',
        display: 'block'
      },

      // structure
      '.wrapper': {
        maxWidth: '1920px',
        margin: '0 auto'
      },
      '.container': {
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0 20px'
      },

      // scroll bar
      '::-webkit-scrollbar': {
        width: '5px',

        '&-track': {
          background: '#f1f1f1',
          borderRadius: '2rem'
        },

        '&-thumb': {
          background: '#888',
          borderRadius: '2rem',

          '&:hover': {
            background: '#555'
          }
        }
      },

      // others
      '.overlay': {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        bg: 'rgba(0,0,0,0.17)',
        zIndex: '1'
      },
      '.hide-scrollbar': {
        '-ms-overflow-style': 'none',
        'scrollbar-width': 'none',

        '&::-webkit-scrollbar': {
          display: 'none'
        }
      },

      'input[type=password]::-ms-reveal, input[type=password]::-ms-clear': {
        display: 'none'
      }
    }
  },
  components: {
    Button: {
      // 1. We can update the base styles
      baseStyle: {
        fontWeight: '700',
        textTransform: 'capitalize',

        p: '1rem 2rem',
        border: 'none',
        outline: 'none',

        cursor: 'pointer'
      },
      // 2. We can add a new button size or extend existing
      sizes: {
        md: {
          fontSize: '1.1rem',
          lineHeight: '1.1rem'
        },
        lg: {
          fontSize: '1.25rem',
          lineHeight: '1.25rem',
          width: 'fit-content'
        },
        full: {
          p: '1.5rem 2rem',
          fontSize: '1.2rem',
          lineHeight: '1.2rem',
          width: '100%'
        }
      },
      // 3. We can add a new visual variant
      variants: {
        danger: {
          bg: 'red.100',
          color: 'red.200'
        },
        primary: {
          bg: 'primary.400',
          border: '1px solid',
          borderColor: 'transparent',

          _focus: { boxShadow: 'none', outline: 'none', outlineOffset: 0 }
        },
        ['primary-circle']: {
          bg: 'primary.500',
          border: '1px solid transparent',
          borderRadius: '4rem',
          fontWeight: '500'
        },
        default: {
          bg: 'transparent',
          fontWeight: '800',
          color: ({ colorMode }) => (colorMode === 'light' ? 'grey.300' : 'grey.200'),

          _focus: { boxShadow: 'none', outline: 'none', outlineOffset: 0 },

          _hover: { textDecor: 'underline' }
        },
        outline: {
          bg: 'transparent',
          fontWeight: '700',
          border: '1px solid',
          borderColor: ({ colorMode }) => (colorMode === 'light' ? 'grey.300' : 'white.200'),
          transition: 'all 0.25s linear',

          _hover: {
            bg: 'primary.400',
            borderColor: 'primary.400'
          }
        }
      }
    },
    Heading: {
      // 1. We can update the base styles
      baseStyle: {},
      // 2. We can add a new button size or extend existing
      sizes: {},
      // 3. We can add a new visual variant
      variants: {
        normal: {
          fontWeight: 400
        },
        medium: {
          fontWeight: 500
        },
        'semi-bold': {
          fontWeight: 600
        }
      }
    },
    Badge: {
      // 1. We can update the base styles
      baseStyle: {
        fontSize: '1rem',
        p: '0.5rem 0',
        borderRadius: '0.6rem',
        w: '10rem',
        textAlign: 'center',
        overflow: 'hidden'
      },
      // 2. We can add a new button size or extend existing
      sizes: {},
      // 3. We can add a new visual variant
      variants: {
        inActive: {
          bg: 'red.200',
          color: 'white'
        },
        active: {
          bg: 'green',
          color: 'white'
        },
        failed: {
          bg: 'red.200',
          color: 'white'
        },
        success: {
          bg: 'green',
          color: 'white'
        },
        confirmed: {
          bg: 'purple.400',
          color: 'white'
        }
      }
    },
    Radio: {
      // 1. We can update the base styles
      baseStyle: {
        label: {
          fontWeight: 600
        }
      },
      // 2. We can add a new button size or extend existing
      sizes: {
        lg: {
          label: {
            fontSize: '1.2rem'
          }
        }
      },
      // 3. We can add a new visual variant
      variants: {}
    }
  }
});
