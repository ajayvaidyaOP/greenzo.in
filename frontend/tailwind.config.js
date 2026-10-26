/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canopy: { 950: '#0A1A12', 900: '#12261B', 850: '#1A3324', 800: '#1E3B2B', 700: '#2A4F3A', 600: '#3A6B4F', 500: '#5A8A6D', 400: '#8AB39D', 100: '#E6EFE8', 50: '#F4F7F5', 25: '#FAFBF9' },
        linen: { 50: '#FDFCF9', 75: '#FBF9F4', 100: '#F6F1E7', 150: '#F0E8D5', 200: '#E8DDC3', 300: '#D8C9A8', 400: '#C4B08A' },
        terracotta: { 600: '#A83A1F', 500: '#C44A2A', 400: '#D86E4A', 50: '#FDF0EB', 100: '#FCE8E0' },
        brass: { 600: '#9A7B2E', 500: '#B9973F', 400: '#D2B15E', 50: '#FDF8EC' },
        stone: { 900: '#1C1C1A', 800: '#2B2B28', 700: '#4A4A46', 500: '#8A8A86', 300: '#C8C8C4', 100: '#E8E8E4', 50: '#F5F5F3' },
        mist: { 50: '#F8FAF8', 100: '#EEF2EE', 200: '#DDE6DD' },
      },
      fontFamily: { serif: ['"Cormorant Garamond"', 'Georgia', 'serif'], sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'] },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(18,38,27,0.08), 0 1px 3px rgba(0,0,0,0.05)',
        'soft-lg': '0 12px 40px -12px rgba(18,38,27,0.12), 0 4px 12px rgba(0,0,0,0.06)',
        elevated: '0 24px 60px -16px rgba(18,38,27,0.18), 0 8px 24px rgba(0,0,0,0.08)',
        'card': '0 8px 28px -8px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      },
      borderRadius: { '4xl': '32px', '5xl': '40px' },
      animation: { 'fade-in': 'fadeIn 0.6s ease-out', 'marquee': 'marquee 28s linear infinite' },
      keyframes: { fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } } },
    },
  },
  plugins: [],
};
