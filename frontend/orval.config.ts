import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:18000/api/v1/openapi.json',
    },
    output: {
      mode: 'split',
      target: './src/api/generated.ts',
      schemas: './src/api/model',
      client: 'react-query',
      tsconfig: './tsconfig.app.json',
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});