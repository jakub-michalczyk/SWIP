/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      fontSize: {
        "6.5xl": ["4rem", { lineHeight: "1.2" }],
        "3.5xl": ["2rem", { lineHeight: "1.2" }],
      },
      fontFamily: {
        sans: ["Afcad", "sans-serif"],
      },
      colors: {
        "red-650": "#DB4A2B",
        "neutral-950": "#1B1919",
        "gray-150": "#F5ECEC",
      },
    },
  },
  plugins: [],
};
