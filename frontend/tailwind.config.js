/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep forest — primary dark surfaces
        canopy: {
          950: '#0A1512',
          900: '#0F1F19',
          850: '#14291F',
          800: '#1B3A2B',
          700: '#26503B',
          600: '#356B50',
          500: '#4C8870',
          400: '#7DAE95',
          300: '#A9C8B7',
          200: '#CBE0D3',
          100: '#E1ECE4',
          50: '#F0F6F1',
          25: '#F7FAF6'
        },
        // Warm travertine / ivory paper tones
        linen: {
          50: '#FBF8F1',
          75: '#F8F3E8',
          100: '#F3ECDD',
          150: '#EBE1CD',
          200: '#E1D3B8',
          300: '#CFBE9B',
          400: '#B9A279'
        },
        // Antique brass — the signature accent
        brass: {
          700: '#6E5322',
          600: '#8C6B2F',
          500: '#B08A3E',
          400: '#CBA95F',
          300: '#E2C98F',
          200: '#F0E2C1',
          100: '#F7EED6',
          50: '#FAF3E2'
        },
        // Burnished clay accent
        terracotta: {
          700: '#8A3D20',
          600: '#A34A2B',
          500: '#BF5C37',
          400: '#D98A63',
          300: '#E8AE8D',
          200: '#EBC4AE',
          100: '#F6E1D4',
          50: '#FCF2EA'
        },
        // Warm neutral greys (replaces cool stone)
        stone: {
          50: '#F7F6F1',
          100: '#EFEDE5',
          200: '#E2DFD4',
          300: '#CBC7B9',
          400: '#A8A395',
          500: '#86816F',
          600: '#666156',
          700: '#4C4841',
          800: '#332F2A',
          900: '#1F1D1A'
        },
        mist: { 50: '#F7F9F6', 100: '#EEF2EC', 200: '#DDE5D9' }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif']
      },
      fontSize: {
        '2xs': ['10.5px', { lineHeight: '14px' }],
        '3xs': ['9.5px', { lineHeight: '12px' }]
      },
      letterSpacing: {
        'ultra': '0.32em'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(10,21,18,0.04), 0 10px 28px -18px rgba(10,21,18,0.28)',
        card: '0 1px 2px rgba(10,21,18,0.05), 0 16px 40px -24px rgba(10,21,18,0.35)',
        'soft-lg': '0 2px 6px rgba(10,21,18,0.05), 0 28px 60px -30px rgba(10,21,18,0.40)',
        elevated: '0 4px 12px rgba(10,21,18,0.08), 0 40px 80px -36px rgba(10,21,18,0.48)',
        gold: '0 12px 34px -16px rgba(176,138,62,0.55)',
        'inset-line': 'inset 0 0 0 1px rgba(255,255,255,0.08)'
      },
      borderRadius: { '4xl': '32px', '5xl': '40px', '6xl': '48px' },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'marquee': 'marquee 42s linear infinite',
        'float-soft': 'floatSoft 7s ease-in-out infinite',
        'ken-burns': 'kenBurns 22s ease-in-out infinite alternate',
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2.2s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        'sheen': 'sheen 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translate3d(0,18px,0)' }, '100%': { opacity: '1', transform: 'none' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideInLeft: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floatSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        kenBurns: { '0%': { transform: 'scale(1) translate(0,0)' }, '100%': { transform: 'scale(1.08) translate(-1%, -1%)' } },
        pulseRing: { '0%': { transform: 'scale(0.85)', opacity: '0.7' }, '100%': { transform: 'scale(1.9)', opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '-460px 0' }, '100%': { backgroundPosition: '460px 0' } },
        sheen: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.7' } }
      }
    }
  },
  plugins: []
};
