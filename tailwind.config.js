import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react\\class-list.json",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          '01': '#02385a',
          '02': '#0c649b',
          '03': '#0f74b4',
          '04': '#5283a1',
          '05': '#025673',
          '06': '#007590',
          '07': '#2096ab',
          '08': '#31a8be',
          '09': '#5acae0',
          '10': '#98d1e2',
          '11': '#b5d2d8',
        },
      },
    },
  },
  plugins: [flowbiteReact],
}

