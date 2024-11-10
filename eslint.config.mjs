import antfu from '@antfu/eslint-config';

export default antfu({
  extends: ['next/core-web-vitals'],
  ignores: ['**/*.json'],
  react: true,
  stylistic: {
    semi: true, // We write semicolons? Change if we don't
  },
  rules: {
    'ts/consistent-type-definitions': ['error', 'type'], // We prefer types over interfaces
  },
});
