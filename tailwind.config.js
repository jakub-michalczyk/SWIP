/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}", "./public/translation/**/*.json"],
  theme: {
    extend: {
      fontSize: {
        "6.5xl": ["4rem", { lineHeight: "1.2" }],
        "3.5xl": ["2rem", { lineHeight: "1.2" }],
      },
      margin: {
        "0.25": "1px"
      },
      fontFamily: {
        sans: ["Afacad", "serif"]
      },
      height: {
        "30": "7.5rem",
        "17/20": "85%"
      },
      width: {
        "3/10": "30%",
        "97": "30rem"
      },
      colors: {
        "red-650": "#DB4A2B",
        "neutral-950": "#1B1919",
        "gray-150": "#F5ECEC",
      },
      backgroundImage: {
        "home-desktop": "url('/images/desktop_bg.png')",
        "home-mobile": "url('/images/mobile_bg.png')",
        "wave": "url('/images/wave.svg')",
        "corner": "url('/images/corner.png')",
        "monogram": "url('/images/monogram.png')"
      },
    },
  },
  plugins: [],
};
