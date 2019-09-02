module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'simple-import-sort',
  ],
  rules: {
    'no-console': 'off',
    'max-len': ['warn', {'code': 100}],
    'comma-dangle': 'off',
    'no-underscore-dangle': 'off',
    'simple-import-sort/sort': 'error',
    'no-unused-vars': 'off',
    'no-param-reassign': 'off',
  },
  globals: {
    document: 'readonly',
    window: 'readonly',
  }
};
