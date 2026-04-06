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
          50: '#f0f4ff',
          100: '#e6edff',
          200: '#cddcff',
          300: '#a4c3ff',
          400: '#7d9eff',
          500: '#5577f8',
          600: '#3d54e8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
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