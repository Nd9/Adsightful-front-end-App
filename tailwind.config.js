/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'media', // 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4B91F1',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },
        success: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        warning: {
          light: '#FBBF24',
          DEFAULT: '#F59E0B',
          dark: '#B45309',
        },
        danger: {
          light: '#F87171',
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} 