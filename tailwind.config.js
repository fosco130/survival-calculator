/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0E1A',
        'bg-secondary': '#151B2D',
        'bg-tertiary': '#1E2740',
        'bg-elevated': '#252E47',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B8C5D6',
        'text-tertiary': '#7A8BA3',
        'border-subtle': '#2A3548',
        'border-default': '#3D4A63',
        'border-strong': '#4F5D78',
        'safe': {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        'nervous': {
          DEFAULT: '#FBBF24',
          light: '#FCD34D',
          dark: '#F59E0B',
        },
        'danger': {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'hero': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'count-up': 'countUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
