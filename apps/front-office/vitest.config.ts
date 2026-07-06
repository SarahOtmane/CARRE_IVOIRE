import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const monorepoRoot = resolve(__dirname, '../..')
const frontSrc = resolve(__dirname, 'src')

export default defineConfig({
  plugins: [vue()],
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': frontSrc,
    },
  },
  test: {
    root: monorepoRoot,
    environment: 'happy-dom',
    globals: true,
    include: [
      'apps/front-office/src/**/*.spec.ts',
      'packages/composables/src/**/*.spec.ts',
      'packages/stores/src/**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'packages/composables/src/**/*.ts',
        'packages/stores/src/**/*.ts',
      ],
      exclude: [
        '**/*.spec.ts',
        '**/index.ts',
        '**/pinia-persist.d.ts',
      ],
      reporter: ['text', 'text-summary'],
    },
  },
})
