/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#BB3F95',
        'primary-hover': '#6B4773',
        secondary: '#231F48',
        accent: '#560A39',
        'background-light': '#f8f6f7',
        surface: '#ffffff',
        'text-main': '#231F48',
        'text-muted': '#8a8a93',
        'border-subtle': '#E0E1F6',
        error: '#ba1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
      },
      boxShadow: {
        card: '0 4px 12px rgba(35, 31, 72, 0.08)',
        focus: '0 0 0 2px rgba(187, 63, 149, 0.2)',
      },
    },
  },
  plugins: [],
}
