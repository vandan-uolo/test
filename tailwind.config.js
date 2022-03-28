module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        elegreen: '#4CBB17',
        borderGray: '#666666',
        borderGray1: '#E2E2E2',
        bgGreen: '#F2FAEF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
