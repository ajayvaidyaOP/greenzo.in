/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canopy: {
          950: '#0D1B13',
          900: '#152A1E',
          800: '#1E3B2B',
          700: '#2B523C',
          600: '#3C6E52',
          500: '#4F8A68',
          100: '#E4EFE7',
          50: '#F2F7F3'
        },
        linen: {
          50: '#FCFBF8',
          100: '#F7F3EB',
          200: '#EFE7D8',
          300: '#E2D5BE'
        },
        terracotta: {
          600: '#B83D24',
          500: '#CE4B30',
          50: '#FDF1EE'
        },
        brass: {
          500: '#C49A45',
          400: '#D4AF61'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 35px -10px rgba(21, 42, 30, 0.08)',
        elevated: '0 22px 50px -12px rgba(21, 42, 30, 0.16)'
      }
    }
  },
  plugins: []
};
