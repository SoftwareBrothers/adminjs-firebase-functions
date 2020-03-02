module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
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
    'react',
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        "react/prop-types": 'off',
        "react/jsx-filename-extension": 'off',
      },
      settings: {
        "import/core-modules": [
          "react",
          "react-router-dom",
          "prop-types",
          "styled-components",
          "react-select",
          "flat"
        ]
      }
    }
  ],
  rules: {
    "import/no-unresolved": 'off',
    "import/extensions": 'off',
    "import/prefer-default-export": 'off',
    "no-underscore-dangle": 'off',
  },
};
