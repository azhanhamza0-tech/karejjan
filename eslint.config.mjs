import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'node_modules/**/*', 'functions/lib/**/*', 'apps/**/*', 'src/**/*', 'server.ts', '*.config.*'],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
