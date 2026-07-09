/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D14',
        pink: '#E0306A',
        salmon: '#F4896B',
        gold: '#F4C542',
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 20%, rgba(224,48,106,0.35), transparent 60%)',
      },
    },
  },
  plugins: [],
};
