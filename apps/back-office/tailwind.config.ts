import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFDF6',
        'rose-powder': '#EAD7D1',
        beige: '#F2E8E4',
        cocoa: '#4A2E2A',
        gold: '#C9A86A',
      },
      fontFamily: {
        display: ['Kingred Modern', 'Georgia', 'serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
