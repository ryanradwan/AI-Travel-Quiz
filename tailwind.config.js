/** @type {import('tailwindcss').Config} */
// Tailwind CSS configuration with The Next Stamp brand color palette
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Brand color palette — do not change these values
      colors: {
        'dark-brown':    '#5d4430',
        'medium-brown':  '#7b5e42',
        'caramel':       '#a1775c',
        'warm-sand':     '#ddccb8',
        'light-linen':   '#ede8e3',
        'cream':         '#f2e9da',
      },
      // Editorial typography
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'lato':     ['Lato', 'sans-serif'],
      },
      // Custom box shadows for cards
      boxShadow: {
        'card':    '0 4px 24px rgba(93, 68, 48, 0.10)',
        'card-lg': '0 8px 40px rgba(93, 68, 48, 0.15)',
      },
    },
  },
  plugins: [],
}
