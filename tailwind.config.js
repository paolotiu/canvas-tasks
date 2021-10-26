const { slate, grayDark, mauve, grass, red } = require('@radix-ui/colors');
const colors = require('tailwindcss/colors');

const darkGray = Object.values(grayDark);
module.exports = {
  purge: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        ...slate,
        ...grayDark,
        ...mauve,
        ...red,
        success: grass.grass8,
        danger: {
          MAIN: red.red8,
        },
        grayDark: {
          ...darkGray,
        },
      },
      boxShadow: {},
      maxWidth: {
        popper: '265px',
      },
    },
    colors: {
      gray: colors.trueGray,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
