import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ivoire: {
          DEFAULT: 'var(--ivoire)',
          deep:    'var(--ivoire-deep)',
        },
        'rose-poudre': {
          DEFAULT: 'var(--rose-poudre)',
          '2':     'var(--rose-poudre-2)',
        },
        'beige-doux': {
          DEFAULT: 'var(--beige-doux)',
          '2':     'var(--beige-doux-2)',
        },
        'brun-cacao': {
          DEFAULT: 'var(--brun-cacao)',
          '2':     'var(--brun-cacao-2)',
          '3':     'var(--brun-cacao-3)',
        },
        dore: {
          DEFAULT: 'var(--dore)',
          deep:    'var(--dore-deep)',
        },
        papier: 'var(--papier)',
      },
      fontFamily: {
        serif:   ['Cormorant Garamond', 'EB Garamond', 'Georgia', 'Times New Roman', 'serif'],
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Kingred Modern', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        ambient: 'var(--ease-ambient)',
        ui:      'var(--ease-ui)',
      },
      transitionDuration: {
        '180': '180ms',
        '400': '400ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
} satisfies Config
