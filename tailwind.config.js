const { slate, gray, mauve, grass } = require('@radix-ui/colors');
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
        success: grass.grass8,
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
