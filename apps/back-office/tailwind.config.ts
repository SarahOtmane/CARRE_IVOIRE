import preset from '@carre-ivoire/config/tailwind'
import type { Config } from 'tailwindcss'

export default {
  presets: [preset],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
} satisfies Config
