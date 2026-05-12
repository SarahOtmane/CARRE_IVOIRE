/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ivoire: {
          DEFAULT: 'var(--ivoire)',
          deep: 'var(--ivoire-deep)',
        },
        'rose-poudre': {
          DEFAULT: 'var(--rose-poudre)',
          '2': 'var(--rose-poudre-2)',
        },
        'beige-doux': {
          DEFAULT: 'var(--beige-doux)',
          '2': 'var(--beige-doux-2)',
        },
        cacao: {
          DEFAULT: 'var(--brun-cacao)',
          '2': 'var(--brun-cacao-2)',
          '3': 'var(--brun-cacao-3)',
        },
        'brun-cacao': {
          DEFAULT: 'var(--brun-cacao)',
          '2': 'var(--brun-cacao-2)',
          '3': 'var(--brun-cacao-3)',
        },
        dore: {
          DEFAULT: 'var(--dore)',
          deep: 'var(--dore-deep)',
        },
        papier: 'var(--papier)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'EB Garamond', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        label: ['Inter', '-apple-system', 'sans-serif'],
        serif: ['Cormorant Garamond', 'EB Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        brand: '0px',
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
      },
      transitionTimingFunction: {
        ambient: 'var(--ease-ambient)',
        ui: 'var(--ease-ui)',
      },
      transitionDuration: {
        '180': '180ms',
        '400': '400ms',
        '800': '800ms',
      },
    },
  },
}
