// eslint.config.js
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors
      'no-unused-vars': 'warn', // Warn about unused variables
      'no-console': 'off', // Allow console logs
      'no-unused-expressions': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
