const { slate, grayDark, mauve, grass, red } = require('@radix-ui/colors');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const darkGray = Object.values(grayDark);
module.exports = {
  purge: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    screens: {
      900: '900px',
      ...defaultTheme.screens,
    },
    fontFamily: {
      // sans: ['Outfit', 'sans-serif'],
    },
    extend: {
      colors: {
        ...slate,
        ...grayDark,
        ...mauve,
        ...red,
        radix: {
          ...slate,
        },
        success: grass.grass8,
        danger: {
          MAIN: red.red8,
        },
        grayDark: {
          ...darkGray,
        },

        notion: {
          dark: '#2f3437',
          darkHover: '#44494b',
          'text-dark': 'rgba(255, 255, 255, 0.9)',
        },
        gray: colors.neutral,
      },
      boxShadow: {},
      maxWidth: {
        popper: '265px',
      },
      fontSize: {
        15: '15px',
      },
      screens: {},
    },
    // colors: {
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/typography')],
};
