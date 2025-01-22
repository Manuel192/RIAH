/** @type {import('tailwindcss').Config} */
/* eslint-disable max-len */
const colors = require('tailwindcss/colors');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Archivos de tu proyecto
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}" // Archivos de Tremor
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
