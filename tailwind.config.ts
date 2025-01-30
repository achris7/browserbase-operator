import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#dcdcdc',
          secondary: '#e7e7e7',
        },
        primary: {
          DEFAULT: '#6d78d5',
          hover: '#6671c9',
        },
        text: {
          DEFAULT: '#1a1a1a',
          secondary: '#5c5c5e',
          muted: '#9d9d9f',
        },
        background: {
          DEFAULT: '#fbfbfb',
          white: '#ffffff',
          accent: 'rgba(236,69,230,0.12)',
        },
      },
      boxShadow: {
        button: '0px 4px 4px -1px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: '11px',
        sm: '12px',
        base: '13px',
        lg: '15px',
        xl: '18px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
}

export default config;
