/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['**/*.tsx', '../components/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        aPrimary: '#4527A0',
        aPrimaryDark: '#311B92',
        aSecondary: '#BF360C',
        aTextBlack: '#212121',
        aTextWhite: '#EAEAEA',
      },
      backgroundImage: {
        aShimmer:
          'linear-gradient(-60deg, transparent 40%, rgba(255, 255, 255, 0.05), transparent 60%)',
        aShimmerLight:
          'linear-gradient(-60deg, transparent 40%, rgba(0, 0, 0, 0.1), transparent 60%)',
      },
      boxShadow: {
        aCard: '0 0 20px 2px rgba(0, 0, 0, 0.15)',
        aCardWhite: '0 0 20px 2px rgba(255, 255, 255, 0.1)',
        aCardPrimary: '0 0 20px 2px rgba(69, 39, 160, 0.5)',
        aCardPrimaryActive: '0 0 20px 2px rgba(49, 27, 146, 0.75)',
      },
      fontFamily: {
        sans: 'Roboto',
        teko: 'Teko',
      },
      aspectRatio: {
        a4: '1/1.4142',
        '3/4': '3/4',
      },
      screens: {
        smallHeight: { raw: '(max-height: 900px) and (min-width: 640px)' },
        xsm: '420px',
      },
      animation: {
        aFadeIn: 'fadeIn 250ms ease-in-out',
        aFadeInSlow: 'fadeIn 500ms ease-in-out',
        aFadeInScale: 'fadeInScale 250ms ease-in-out',
        aShimmer: 'shimmer 1.25s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInScale: {
          '0%': { opacity: '0', scale: '1' },
          '50%': { opacity: '0.5', scale: '1.2' },
          '100%': { opacity: '1', scale: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '100%' },
          '100%': { backgroundPosition: '0%' },
        },
      },
    },
  },
};
