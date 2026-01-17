export default {
  extends: ['stylelint-config-clean-order', 'stylelint-config-standard'],
  rules: { 'selector-class-pattern': null },
  ignoreFiles: ['node_modules/**', 'coverage/**', 'dist/**'],
};
