module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        mongo: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'no-console': 'off',
        'prettier/prettier': 'error',
        'linebreak-style': ['error', 'windows'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
    },
    plugins: ['prettier'],
};
