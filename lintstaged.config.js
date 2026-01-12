export default {
  'package.json': ['sort-package-json'],
  'src/**/*.{js,ts}': ['eslint --fix', 'prettier --write'],
  'src/**/*.css': ['stylelint --fix', 'prettier --write'],
  '*.html': ['prettier --write'],
};
