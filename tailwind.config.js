/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        "primary-light": "#D5E7FD",
        "primary": "#1560BD",
        "primary-dark": "#053167",
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

