module.exports = {
  purge: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {
      colors: require('@radix-ui/colors'),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
