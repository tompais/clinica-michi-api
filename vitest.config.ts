import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

// SWC compila los decoradores de Nest con su metadata. Sin esto, la inyección no anda en los tests.
export default defineConfig({
  test: {
    include: ['test/**/*.spec.ts'],
    environment: 'node',
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
})
