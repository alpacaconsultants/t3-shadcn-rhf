/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@strixy/eslint-config'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.eslintrc.cjs'],
  parserOptions: {
    project: true,
  },
};
