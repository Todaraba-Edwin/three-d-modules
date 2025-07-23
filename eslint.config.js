import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginReact from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import path from 'path';

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
  },
  rules: {
    // console
    'no-console': ['warn', { allow: ['warn', 'error'] }], // console 사용시 경고, 프로덕션 코드에는 남지 않도록 경고 처리

    // TS
    '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용은 제한하여 타입 안전성 강화
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // 함수/컴포넌트 export 시 명시적 리턴 타입 권장

    // etc
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고, _로 시작하는 인자 무시
    'prefer-const': 'warn', // 변경되지 않는 변수 const 권장
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // 과도한 빈 줄 제거
  },
  extends: [
    js.configs.recommended, // no-unused-vars 여부포함
    tseslint.configs.recommended,
    reactHooks.configs['recommended-latest'],
    reactRefresh.configs.vite,
    prettier,
  ],
});

const utilsNodeConfig = () => {
  return {
    files: ['scripts/**/*.{ts,js}', '*.config.{ts,js}'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json'],
      },
    },
    rules: {
      'no-console': 'off',
    },
  };
};

export default tseslint.config(
  globalIgnores(['dist', 'node_modules']),

  // App 전용 코드
  utilsAddConfig({
    projectPath: './packages/shared/tsconfig.app.json',
    matchPath: 'packages/shared/**/*.{ts,tsx}',
  }),
  utilsAddConfig({
    projectPath: './apps/project-a/tsconfig.app.json',
    matchPath: 'apps/project-a/**/*.{ts,tsx}',
  }),
  utilsAddConfig({
    projectPath: './apps/threedtargetbuilding/tsconfig.app.json',
    matchPath: 'apps/threedtargetbuilding/**/*.{ts,tsx}',
  }),
  utilsNodeConfig()
);
