/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d', // Dark blue
          light: '#2c5282',
          dark: '#0f2942',
        },
        accent: {
          DEFAULT: '#10b981', // Vibrant green
          light: '#34d399',
          dark: '#059669',
        },
        background: {
          DEFAULT: '#f8fafc',
          dark: '#1e293b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cursive: ['Dancing Script', 'cursive'],
        highlight: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}; 