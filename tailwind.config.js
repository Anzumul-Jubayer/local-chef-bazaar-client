/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'primary': {
          DEFAULT: '#D4AF37',
          50: '#FDF8E7',
          100: '#FAF0C4',
          200: '#F5E085',
          300: '#F0D046',
          400: '#EBC007',
          500: '#D4AF37',
          600: '#B8962C',
          700: '#9C7D21',
          800: '#806416',
          900: '#644B0B'
        },
        'secondary': {
          DEFAULT: '#7D2E2E',
          50: '#F5E8E8',
          100: '#E8C5C5',
          200: '#D49F9F',
          300: '#C07979',
          400: '#B05959',
          500: '#7D2E2E',
          600: '#6B2525',
          700: '#591C1C',
          800: '#471313',
          900: '#350A0A'
        },
        'accent': {
          DEFAULT: '#2E7D32',
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#2E7D32',
          600: '#388E3C',
          700: '#2E7D32',
          800: '#2E7D32',
          900: '#1B5E20'
        },
        // Semantic colors
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'muted': 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
        // Base colors for compatibility
        'base-100': 'var(--color-background)',
        'base-200': 'var(--color-surface)',
        'base-300': 'var(--color-border)',
        'base-content': 'var(--color-text-primary)',
        'hover': 'var(--color-hover)',
        'success': '#10b981',
        'warning': '#FBBD23',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
}