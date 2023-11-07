module.exports = {
  root: true,
  extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript', 'prettier'],
  plugins: ['@typescript-eslint', 'only-warn', 'prettier', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    // unnecessary for react 17+
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    // not compatible with monorepos (when listing commen dependecies in the root package.json)
    'import/no-extraneous-dependencies': 'off',

    // compatibility with lexical playground
    // consider removing some of these rules later
    'react/destructuring-assignment': 'off',
    'react/button-has-type': 'off',
    'react/style-prop-object': 'off',
    'react/require-default-props': 'off',
    'react/no-unstable-nested-components': 'off',
    'import/no-cycle': 'off',
    'class-methods-use-this': 'off',
    'arrow-body-style': 'off',
    'prefer-template': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-bitwise': 'off',
    'consistent-return': 'off',
    'prefer-destructuring': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-loop-func': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'jsx-a11y/iframe-has-title': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/control-has-associated-label': 'off',

    // too much strict for development
    'react/self-closing-comp': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/prop-types': 'off',
    'no-prototype-builtins': 'off',
    'react/no-unescaped-entities': 'off',

    // following rules enable auto-fix for `no-unused-imports`
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
