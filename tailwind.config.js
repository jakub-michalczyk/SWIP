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
        sans: ["Afacad", "serif"],
      },
      colors: {
        "red-650": "#DB4A2B",
        "neutral-950": "#1B1919",
        "gray-150": "#F5ECEC",
      },
      backgroundImage: {
        "home-desktop": "url('/images/desktop_bg.png')",
        "home-mobile": "url('/images/mobile_bg.png')",
        "circles": "url('/images/circles_bg.png')",
        "wave": "url('/images/wave.svg')"
      },
    },
  },
  plugins: [],
};
