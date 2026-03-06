/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        shell: '#f3f5f8',
        ink: '#142132',
        mist: '#eef2f7',
        stroke: '#d8e0ea',
        brand: '#14532d',
        accent: '#0f766e',
        warm: '#b45309',
        danger: '#b91c1c'
      },
      fontFamily: {
        sans: ['Manrope', 'Trebuchet MS', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        panel: '0 18px 42px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
