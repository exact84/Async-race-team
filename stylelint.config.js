export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],
  rules: { 'selector-class-pattern': null },
  ignoreFiles: ['node_modules/**', 'coverage/**', 'dist/**'],
};
