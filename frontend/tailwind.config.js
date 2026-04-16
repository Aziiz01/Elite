/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        accent: '#e02020',
        gold: '#A16207',
        'warm-black': '#1C1917',
        'warm-white': '#FAFAF9',
        'warm-border': '#D6D3D1',
      },
    },
  },
  plugins: [],
}
