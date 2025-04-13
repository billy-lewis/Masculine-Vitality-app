/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#111206',
        primary: '#f7cf14',
        'off-white': '#f5f5f5'
      },
    },
  },
  plugins: [],
};