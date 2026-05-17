/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#FFF9F0',
        'primary': '#8BB9D6',
        'accent': '#F4A6B2',
        'focus': '#8BB9D6',
        'rest': '#F4C58F',
        'success': '#7CB987',
      },
      fontFamily: {
        'pixel': ['M PLUS Rounded 1c', 'sans-serif'],
      },
      width: {
        'window': '320px',
      },
      height: {
        'window': '480px',
      },
    },
  },
  plugins: [],
}