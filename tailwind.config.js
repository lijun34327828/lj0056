/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        space: {
          900: "#0A1929",
          800: "#0F2744",
          700: "#163A5F",
          600: "#1E4976",
        },
        accent: {
          DEFAULT: "#1890FF",
          50: "#E6F4FF",
          100: "#BAE0FF",
          200: "#91CAFF",
          300: "#69B1FF",
          400: "#4096FF",
          500: "#1890FF",
          600: "#096DD9",
          700: "#0050B3",
        },
        warning: "#FAAD14",
        danger: "#FF4D4F",
        idle: {
          warning: "#FAAD14",
          danger: "#A8071A",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Noto Sans SC", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(24, 144, 255, 0.3)",
        "glow-sm": "0 0 10px rgba(24, 144, 255, 0.2)",
        "glow-lg": "0 0 40px rgba(24, 144, 255, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 1s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};
