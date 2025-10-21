// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';

const commonRules = {
  // console
  'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // console 사용시 경고, 프로덕션 코드에는 남지 않도록 경고 처리

  // TS
  '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용은 제한하여 타입 안전성 강화
  '@typescript-eslint/explicit-module-boundary-types': 'warn', // 함수/컴포넌트 export 시 명시적 리턴 타입 권장

  // etc
  'prefer-const': 'warn', // 변경되지 않는 변수 const 권장
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // 과도한 빈 줄 제거

  // setting
  'no-warning-comments': [
    'warn',
    { terms: ['todo'], location: 'start' }, // start: 줄 앞에 위치할 때만
  ],
};

const utilsAddConfig = ({ projectPath, matchPath }) => ({
  files: [matchPath],
  languageOptions: {
    parserOptions: {
      // ✅ 문자열로 지정해야 함 (절대경로로도 OK)
      project: [path.resolve(process.cwd(), projectPath)],
      tsconfigRootDir: process.cwd(),
    },
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    react: eslintPluginReact,
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    ...commonRules,
    // etc
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고, _로 시작하는 인자 무시
  },
  extends: [
    js.configs.recommended, // no-unused-vars 여부포함
    tseslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite, // 한 파일은 하나의 컴포넌트만을 export 하도록 규칙
    prettier,
  ],
});

const utilsNodeConfig = () => ({
  files: [
    'scripts/**/*.{ts,js}',
    '*.config.{ts,js}',
    '**/.storybook/*.{ts,js}',
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json'],
    },
  },
  rules: {
    'no-console': 'off',
  },
});

const utilsServerConfig = ({ projectPath, matchPath }) => ({
  files: [matchPath],
  languageOptions: {
    parserOptions: {
      project: [path.resolve(process.cwd(), projectPath)],
      tsconfigRootDir: process.cwd(),
    },
    globals: globals.node,
  },
  rules: {
    ...commonRules,
  },
  extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
});

export default tseslint.config(
  // App 전용 코드
  {
    ignores: [
      '**/.DS_Store',
      '**/dist/**',
      '**/node_modules/**',
      '.pnpm-store/**',
      '**/build/**',
    ],
  },
  utilsAddConfig({
    projectPath: './_apps/shared/tsconfig.app.json',
    matchPath: '_apps/shared/**/*.{ts,tsx}',
  }),
  utilsAddConfig({
    projectPath: './_apps/buildings/tsconfig.app.json',
    matchPath: '_apps/buildings/**/*.{ts,tsx}',
  }),
  utilsServerConfig({
    projectPath: './_servers/server/tsconfig.json',
    matchPath: '_servers/server/**/*.ts',
  }),
  utilsNodeConfig({}),
  storybook.configs['flat/recommended'],
  storybook.configs['flat/recommended']
);
