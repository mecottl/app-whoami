import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
  },
  resolve: {
    // el código fuente importa con extensión .js (NodeNext); en test resuelven al .ts
    // @ts-expect-error extensionAlias es válido en Vite; el tipo re-exportado por vitest no lo lista
    extensionAlias: { '.js': ['.ts', '.js'] },
  },
})
