module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:mocha/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "import/no-unresolved": 'off',
    "import/extensions": 'off',
    "import/prefer-default-export": 'off',
    "no-underscore-dangle": 'off',
  },
  overrides: [
    {
      files: [
          '*.spec.ts',
      ],
      rules: {
        'mocha/no-mocha-arrows': 'off',
        'no-unused-expressions': 'off',
        'func-names': 'off',
        'prefer-arrow-callback': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
