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
          50: '#f4efeb',
          100: '#e7dbd3',
          200: '#d2c1b6',
          300: '#8fa4b6',
          400: '#6e89a0',
          500: '#456882',
          600: '#234c6a',
          700: '#1f445f',
          800: '#1b3c53',
          900: '#142c3d',
        }
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair-display)', 'serif'],
      },
    },
  },
  plugins: [],
}