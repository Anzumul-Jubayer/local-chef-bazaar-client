/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color variables that work with CSS custom properties
        'primary-color': 'var(--color-primary)',
        'secondary-color': 'var(--color-secondary)', 
        'accent-color': 'var(--color-accent)',
        'surface': 'var(--color-surface)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border-color': 'var(--color-border)',
      }
    },
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#D4AF37",
          "secondary": "#7D2E2E", 
          "accent": "#2E7D32",
          "neutral": "#404040",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e5e5e5",
          "info": "#3ABFF8",
          "success": "#2E7D32",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      {
        dark: {
          "primary": "#F4D03F",
          "secondary": "#E74C3C",
          "accent": "#58D68D", 
          "neutral": "#262626",
          "base-100": "#171717",
          "base-200": "#262626",
          "base-300": "#404040",
          "info": "#3ABFF8",
          "success": "#58D68D",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}