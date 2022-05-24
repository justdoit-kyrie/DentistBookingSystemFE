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
    grey: {
      100: '#efefef',
      200: '#bababa',
      300: '#5F5D5B',
      400: '#6e6868',
      500: '#3C3C3C'
    },
    primary: {
      100: '#F5F2EA',
      400: '#93B4FB'
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
        fontSize: '62.5%'
      },

      body: {
        letterSpacing: '0.1rem',
        overflow: 'hidden',
        // eslint-disable-next-line quotes
        fontFamily: `'IBM Plex Sans',ProximaNova,Arial,Tahoma,PingFangSC,sans-serif`
      },

      'button, textarea, input, select, a': {
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
        primary: {
          bg: 'primary.400'
        },
        default: {
          bg: 'transparent',
          fontWeight: '800',
          color: ({ colorMode }) => (colorMode === 'light' ? 'grey.300' : 'grey.200')
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
    }
  }
});
