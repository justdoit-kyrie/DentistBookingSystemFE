const { extendTheme } = require("@chakra-ui/react");

export const theme = extendTheme({
  styles: {
    global: {
      "*,*:before,*:after": {
        m: 0,
        p: 0,
        boxSizing: 'border-box'
      },

      html: {
        fontSize: '62.5%'
      },

      body: {
        bg: 'white',
        color: 'black',
        overFlow: 'hidden'
      },

      a: {
        color: 'currentColor',
        textDecoration: 'none'
      },

      img: {
        maxWidth: '100%',
        display: 'block',
      },
    },
  },
})