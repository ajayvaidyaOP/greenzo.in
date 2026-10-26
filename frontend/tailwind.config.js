/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lush living rainforest emerald — primary brand & dark surfaces
        canopy: {
          950: '#071E15',
          900: '#0B2B1E',
          850: '#103928',
          800: '#154B35',
          700: '#1A6446',
          600: '#1F7F58',
          500: '#279D6C',
          400: '#4DBE8D',
          300: '#89D7B3',
          200: '#BFEAD5',
          100: '#E3F6ED',
          50: '#F1FAF5',
          25: '#F7FCF9'
        },
        // Crisp porcelain & sunlit conservatory ivory (replaces dusty yellow beige)
        linen: {
          50: '#F8FBF9',
          75: '#F1F7F3',
          100: '#E6F0EA',
          150: '#D8E7DE',
          200: '#C5DBC9',
          300: '#A5C5AF',
          400: '#7FA88C'
        },
        // Sunlit champagne gold — ratings, highlights & Studio badges
        brass: {
          700: '#78541A',
          600: '#9A6D23',
          500: '#C28D32',
          400: '#DDA94B',
          300: '#F0CA7D',
          200: '#F8E3B4',
          100: '#FCF1D6',
          50: '#FEF9EC'
        },
        // Warm terracotta clay — limited deals & wishlist
        terracotta: {
          700: '#8F391D',
          600: '#AA4626',
          500: '#C85834',
          400: '#DF8563',
          300: '#ECAD93',
          200: '#F4C9B8',
          100: '#FAE3DA',
          50: '#FDF3EF'
        },
        // Crisp botanical slate-stone neutrals
        stone: {
          50: '#F6F8F7',
          100: '#ECF0EE',
          200: '#DCE3DF',
          300: '#C2CCC6',
          400: '#95A39B',
          500: '#68766E',
          600: '#4C5952',
          700: '#37423C',
          800: '#232B27',
          900: '#141A17'
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#1DA851',
          deep: '#128C7E',
          soft: '#E7FBF0'
        },
        mist: { 50: '#F5FAF7', 100: '#EBF4EE', 200: '#D6E7DC' }
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
        ultra: '0.32em'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(7,30,21,0.04), 0 10px 28px -18px rgba(7,30,21,0.22)',
        card: '0 1px 3px rgba(7,30,21,0.05), 0 18px 42px -22px rgba(7,30,21,0.28)',
        'soft-lg': '0 4px 12px rgba(7,30,21,0.06), 0 28px 60px -28px rgba(7,30,21,0.34)',
        elevated: '0 8px 20px rgba(7,30,21,0.09), 0 40px 80px -34px rgba(7,30,21,0.44)',
        gold: '0 12px 32px -14px rgba(194,141,50,0.48)',
        whatsapp: '0 12px 30px -10px rgba(37,211,102,0.52)',
        'inset-line': 'inset 0 0 0 1px rgba(255,255,255,0.08)'
      },
      borderRadius: { '4xl': '32px', '5xl': '40px', '6xl': '48px' },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)'
      },
      animation: {
        'fade-in': 'fadeIn 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-right': 'slideInRight 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'slide-in-left': 'slideInLeft 0.45s cubic-bezier(0.16,1,0.3,1) both',
        marquee: 'marquee 38s linear infinite',
        'float-soft': 'floatSoft 6s ease-in-out infinite',
        'ken-burns': 'kenBurns 22s ease-in-out infinite alternate',
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'spin-slow': 'spin 18s linear infinite',
        sheen: 'sheen 6s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translate3d(0,16px,0)' }, '100%': { opacity: '1', transform: 'none' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideInLeft: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floatSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-7px)' } },
        kenBurns: { '0%': { transform: 'scale(1) translate(0,0)' }, '100%': { transform: 'scale(1.08) translate(-1%, -1%)' } },
        pulseRing: { '0%': { transform: 'scale(0.85)', opacity: '0.7' }, '100%': { transform: 'scale(1.9)', opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '-460px 0' }, '100%': { backgroundPosition: '460px 0' } },
        sheen: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.7' } }
      }
    }
  },
  plugins: []
};
