import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  unicorn.configs.recommended,
  // importPlugin.configs.recommended,
  perfectionist.configs['recommended-natural'],
  {
    ignores: [
      'dist',
      'node_modules',
      '**/*config.js',
      '**/*config.ts',
      '**/*config.mjs',
      '**/*config.mts',
      '.prettierrc.js',
      '**/*.spec.ts',
      '.stylelintrc.js',
    ],
  },
  {
    languageOptions: { globals: { ...globals.browser }, parserOptions: { projectService: true } },
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: true },
    plugins: { prettier: prettierPlugin, import: importPlugin },

    languageOptions: { parserOptions: { projectService: true } },
    settings: { 'import/resolver': { typescript: true, node: { extensions: ['.js', '.ts'] } } },
    rules: {
      'prettier/prettier': 'error',
      'import/no-cycle': 'error',
      // 'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],
      'import/no-self-import': 'error',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': ['error', { allowList: { env: true } }],
      'lines-between-class-members': ['error', 'always'],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          arrayLiteralTypeAssertions: 'never',
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never',
        },
      ],
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      'default-param-last': 'off',
      '@typescript-eslint/default-param-last': 'error',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-magic-numbers': ['error', { ignore: [0, 1, -1] }],
      'perfectionist/sort-imports': 'error',
    },
  }
);
