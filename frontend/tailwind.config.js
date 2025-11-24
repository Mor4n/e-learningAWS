/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'udemy-purple': '#5624d0',
        'udemy-purple-dark': '#401b9c',
        'udemy-gray': '#1c1d1f',
      },
    },
  },
  plugins: [],
}
