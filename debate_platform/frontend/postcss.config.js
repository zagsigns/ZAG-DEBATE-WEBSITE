// postcss.config.js

/** @type {import('postcss').Config} */
export default {
  plugins: {
    // 1. Correct and standard plugin name for Tailwind CSS
    tailwindcss: {}, 
    
    // 2. Autoprefixer for vendor prefixes
    autoprefixer: {},
  },
}