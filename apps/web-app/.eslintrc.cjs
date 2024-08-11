// Warnings are errors in production
const OFF = 'off';
const ERROR = 'error';

// most rules should be either OFF or ERROR, but use WARNING for things that are common in development but you don't want in production
const WARNING = process.env.NODE_ENV === 'production' ? 'error' : 'warn';

/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'drizzle'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked'],
  rules: {
    'no-console': [WARNING, { allow: ['warn', 'error'] }],
    'import/order': ERROR,
    'react/jsx-curly-brace-presence': ERROR,
    'react/self-closing-comp': ERROR,
    'no-useless-rename': ERROR,
    'arrow-body-style': ERROR,
    'react/jsx-no-useless-fragment': ERROR,
    'react/jsx-boolean-value': ERROR,
    'prefer-template': ERROR,
    '@typescript-eslint/no-unused-vars': WARNING,
    '@typescript-eslint/array-type': OFF,
    '@typescript-eslint/consistent-type-definitions': OFF,
    '@typescript-eslint/consistent-type-imports': [
      WARNING,
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      WARNING,
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/require-await': OFF,
    '@typescript-eslint/no-misused-promises': [
      ERROR,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    'drizzle/enforce-delete-with-where': [
      ERROR,
      {
        drizzleObjectName: ['db', 'ctx.db'],
      },
    ],
    'drizzle/enforce-update-with-where': [
      ERROR,
      {
        drizzleObjectName: ['db', 'ctx.db'],
      },
    ],
  },
};
module.exports = config;
