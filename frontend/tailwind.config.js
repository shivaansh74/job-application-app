module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out'
      },
      colors: {
        dark: {
          'bg-primary': '#1f2937',
          'bg-secondary': '#111827',
          'text-primary': '#f3f4f6',
          'text-secondary': '#d1d5db',
        }
      }
    },
  },
  plugins: [],
}

