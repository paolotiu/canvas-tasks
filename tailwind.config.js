const { slate, gray, mauve } = require('@radix-ui/colors');
module.exports = {
  purge: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        ...slate,
        ...gray,
        ...mauve,
      },
      boxShadow: {},
      maxWidth: {
        popper: '265px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
