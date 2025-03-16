/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xsphone: "480px",
      sphone: "640px",
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
      largedesktop: "1536px",
    },
    extend: {
      colors: {
        primary: "#77B254",
        secondary: "#8B0000",
      },
    },
  },
  plugins: [],
};
