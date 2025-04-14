/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#48a9ff',
        'primary-dark': '#3a8bd6',
        'blue-dark': {
          900: '#0a192f',
          800: '#172a45',
        },
      },
      animation: {
        'spin-slow': 'rotation 20s linear infinite',
      },
      keyframes: {
        rotation: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(359deg)' },
        }
      },
      boxShadow: {
        'album': '0 20px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
