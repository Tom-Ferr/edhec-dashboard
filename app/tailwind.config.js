/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Unilever/Miko brand colors
        'unilever-blue': {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c7d7fe',
          300: '#a5bcfc',
          400: '#819cf8',
          500: '#005eff', // Main blue
          600: '#1f36c7',
          700: '#001f82',
          800: '#001a66',
          900: '#000833',
        },
        'miko-pink': {
          50: '#fef2f2',
          100: '#fce8ec',
          200: '#f8d0d8',
          300: '#f4bcc6',
          400: '#e7284a',
          500: '#e4032c', // Main red/pink
          600: '#cd0125',
          700: '#a3001d',
          800: '#7a0016',
          900: '#52000f',
        },
        'miko-beige': '#f3e8d8',
      },
      fontFamily: {
        'unilever': ['Unilever Shilling', 'sans-serif'],
        'stick-around': ['Stick-A-Round', 'sans-serif'],
      },
    },
  },
  plugins: [],
}