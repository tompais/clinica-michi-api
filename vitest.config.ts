import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

// SWC compila los decoradores de Nest con su metadata. Sin esto, la inyección no anda en los tests.
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      // main.ts y data-source.ts solo arrancan cosas: los usa la app real, no los tests.
      exclude: ['src/main.ts', 'src/shared/infraestructura/database/data-source.ts'],
      // Si la cobertura baja de 80, el comando falla y el CI queda en rojo.
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
  plugins: [swc.vite({ module: { type: 'es6' } })],
})
