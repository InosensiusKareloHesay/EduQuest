import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          greenDark: "#46A302",
          greenLight: "#D7FFB8",
          blue: "#1CB0F6",
          blueDark: "#1899D6",
          blueLight: "#DDF4FF",
          amber: "#FFC800",
          amberDark: "#E5A500",
          amberLight: "#FFF5CC",
          orange: "#FF9600",
          orangeDark: "#CC7800",
          red: "#FF4B4B",
          redDark: "#EA2B2B",
          purple: "#CE82FF",
          purpleDark: "#A559E0",
          purpleLight: "#F5E6FF",
          cardBorder: "#E5E7EB",
          cardBorderDark: "#D1D5DB",
          bgSoft: "#F7F9FB",
        },
      },
      boxShadow: {
        "3d-green": "0 4px 0 #46A302",
        "3d-green-lg": "0 6px 0 #46A302",
        "3d-blue": "0 4px 0 #1899D6",
        "3d-blue-lg": "0 6px 0 #1899D6",
        "3d-amber": "0 4px 0 #E5A500",
        "3d-amber-lg": "0 6px 0 #E5A500",
        "3d-red": "0 4px 0 #EA2B2B",
        "3d-purple": "0 4px 0 #A559E0",
        "3d-purple-lg": "0 6px 0 #A559E0",
        "3d-white": "0 4px 0 #E5E7EB",
        "3d-card": "0 5px 0 #E2E8F0",
        "3d-card-hover": "0 8px 0 #CBD5E1",
      },
      fontFamily: {
        sans: ["Nunito", "system-ui", "sans-serif"],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        shine: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.4s ease-in-out infinite",
        pop: "pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        shine: "shine 2s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
