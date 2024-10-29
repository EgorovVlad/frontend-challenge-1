const js = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'dist/'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.es6,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      'prettier/prettier': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-ins (e.g., 'fs', 'path')
            'external', // External libraries (e.g., npm packages)
            'internal', // Internal modules (e.g., utils, services)
            'parent', // Parent imports (e.g., ../foo)
            'sibling', // Sibling imports (e.g., ./foo)
            'index', // Index file imports (e.g., ./)
            'object', // Imports of the form `import * as foo from 'foo'`
            'type', // Type imports (TypeScript)
          ],
          pathGroups: [
            {
              pattern: '@/**', // Adjust to match your project's internal paths (e.g., alias for internal modules)
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always', // Require new lines between groups
          alphabetize: {
            order: 'asc', // Alphabetize within each group
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
