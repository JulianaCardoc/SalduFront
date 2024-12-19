/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        success: colors.green,
        primary: '#18143c',
        danger: colors.red,
        light: colors.gray,
        yellow: '#e8e454',
        bg: '#212121',
        bghover: '#2f2f2f',
      },
      container: {
        screens : {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1024px',
          '2xl': '1536px',
        },
      }
    }
  },
  plugins: [],
}

