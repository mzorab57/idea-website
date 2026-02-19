/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // بۆ ئینگلیزی
        kurdish: ['Rabar', 'NRT', 'sans-serif'], // فۆنتی کوردی (ناوی فۆنتەکەی خۆت بنووسە)
      },
    },
  },
  plugins: [],
}