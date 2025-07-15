// eslint.config.js (루트)
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';

const commonConfig = (projectPath, matchPath) => ({
  files: [matchPath],
  languageOptions: {
    parserOptions: {
      project: [projectPath],
      tsconfigRootDir: new URL('.', import.meta.url),
    },
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    react: eslintPluginReact,
  },
  rules: {},
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,
    prettier,
  ],
});

export default tseslint.config(
  globalIgnores(['dist', 'node_modules']),
  commonConfig(
    './packages/shared/tsconfig.json',
    'packages/shared/**/*.{ts,tsx}'
  ),
  commonConfig('./apps/project-a/tsconfig.json', 'apps/project-a/**/*.{ts,tsx}')
);
