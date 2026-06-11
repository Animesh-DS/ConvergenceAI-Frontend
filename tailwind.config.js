/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agent: {
          aria: '#10b981', // emerald-500
          rex: '#f43f5e',  // rose-500
          nova: '#0ea5e9', // sky-500
          zara: '#f59e0b', // amber-500
        }
      }
    },
  },
  plugins: [],
}