/** @type {import("eslint").Linter.Config} */
// module.exports = {
//   extends: ['@strixy/eslint-config'],
//   parser: '@typescript-eslint/parser',
//   ignorePatterns: ['.eslintrc.cjs'],
//   parserOptions: {
//     project: true,
//   },
// };
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' },
  rules: {},
};
