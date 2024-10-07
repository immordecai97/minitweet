/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px', // Definir el nuevo breakpoint xs
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // O hacerlo asi
        // 'phone': '480px', // => @media (min-width: 480px) { ... }
        // 'tablet': '640px',// => @media (min-width: 640px) { ... }
        // 'laptop': '1024px',// => @media (min-width: 1024px) { ... }
        // 'desktop': '1280px',// => @media (min-width: 1280px) { ... }
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    aspectRatio,
  ],
}