module.exports = {
    extends: ['plugin:@angular-eslint/recommended'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }
      ]
    },
    overrides: [
      {
        files: ['*.ts'],
        parser: '@typescript-eslint/parser',
        parserOptions: {
          ecmaVersion: 2020,
          sourceType: 'module',
          project: ['*/tsconfig.json', './tsconfig.**.json'] // 追加
        },
        plugins: ['@angular-eslint/template'],
        processor: '@angular-eslint/template/extract-inline-html'
      },
    ],
};
