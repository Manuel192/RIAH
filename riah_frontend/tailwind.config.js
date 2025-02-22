/** @type {import('tailwindcss').Config} */
/* eslint-disable max-len */
const colors = require('tailwindcss/colors');
module.exports = {
  mode: "jit", // Activa el modo Just-In-Time (JIT)
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Archivos de tu proyecto
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}" // Archivos de Tremor
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
};
