import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171916",
        paper: "#f6f7f2",
        lime: "#d9f94a",
        moss: "#5f744a"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "sans-serif"],
        display: ["var(--font-space)", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
