/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fffef5",
        ink: "#1a1423",
        orange: "#ff6b35",
        blue: "#004e98",
        green: "#2d9b4e",
        yellow: "#ffd23f",
        red: "#e63946",
      },
      fontFamily: {
        sans: ["Sora", "Noto Sans SC", "sans-serif"],
      },
      borderWidth: {
        brutal: "2.5px",
      },
      borderRadius: {
        brutal: "3px",
      },
      boxShadow: {
        brutal: "4px 4px 0px 0px #1a1423",
        "brutal-sm": "2px 2px 0px 0px #1a1423",
        "brutal-hover": "6px 6px 0px 0px #1a1423",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
