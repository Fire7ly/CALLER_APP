/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: "#0a0a1a",
          secondary: "#111128",
          card: "rgba(255, 255, 255, 0.04)",
        },
        accent: {
          DEFAULT: "#6c5ce7",
          light: "#a29bfe",
          glow: "rgba(108, 92, 231, 0.35)",
        },
        text: {
          primary: "#f0f0f5",
          secondary: "#9d9db8",
          muted: "#6b6b8a",
        },
        danger: "#ff6b6b",
      },
      fontFamily: {
        inter: ["Inter"],
      },
    },
  },
  plugins: [],
};
