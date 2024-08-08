// Warnings are errors in production
const OFF = 'off';
const ERROR = 'error';

// most rules should be either OFF or ERROR, but use WARNING for things that are common in development but you don't want in production
const WARNING = process.env.NODE_ENV === 'production' || process.env.npm_lifecycle_script === 'lint-staged' ? ERROR : 'warn';

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ['airbnb-typescript', 'airbnb/hooks', 'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    '@typescript-eslint/no-explicit-any': OFF,
    'no-unused-vars': OFF,
    '@typescript-eslint/no-unused-vars': WARNING,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'import/prefer-default-export': OFF,
    'no-restricted-syntax': OFF,
    'guard-for-in': OFF,
    'import/extensions': OFF,
    'react/react-in-jsx-scope': OFF,
    'import/no-absolute-path': OFF,
    'react/jsx-props-no-spreading': OFF,
    'max-len': [
      'error',
      160,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': OFF,
    'no-console': [WARNING, { allow: ['warn', 'error'] }],
    // ToDo turn back on
    'react/button-has-type': OFF,
    'react/prop-types': OFF,
    'react/require-default-props': OFF,
    '@typescript-eslint/no-shadow': OFF,
    'no-param-reassign': OFF,
  },
};
