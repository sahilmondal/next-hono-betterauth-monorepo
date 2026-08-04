import { config } from '@workspace/eslint-config/base';

export default [
  ...config,
  {
    ignores: ['dist', 'node_modules'],
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },
];
