import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2EB875",
          secondary: "#2EB875",
          accent: "#2DB472",
          neutral: "#DEF7EB",
          "base-100": "#FFF",
          info: "#7dd3fc",
          success: "#3BCE87",
          warning: "#fef08a",
          error: "#f43f5e",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
