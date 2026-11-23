// Lint for the site, the server functions and lib (run: cd dev/tools && npm run lint). Not deployed.
import globals from './dev/tools/node_modules/globals/index.js';

export default [
  { ignores: ['site/vendor/**', 'site/app/scene-data.js', 'dev/**', 'mod/**'] },
  {
    files: ['site/app/**/*.js'],
    languageOptions: { ecmaVersion: 2024, sourceType: 'module', globals: { ...globals.browser } },
  },
  {
    files: ['lib/**/*.js', 'functions/**/*.js'],
    languageOptions: { ecmaVersion: 2024, sourceType: 'module', globals: { ...globals.worker, ...globals.serviceworker } },
  },
  {
    rules: {
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-self-assign': 'error',
      'no-redeclare': 'error',
      'no-shadow-restricted-names': 'error',
      'require-await': 'off',
      // a file that keeps growing gets split (main.js was 8,800 lines before the split)
      'max-lines': ['warn', { max: 3200, skipBlankLines: true, skipComments: true }],
      'no-unreachable-loop': 'error',
      'no-constant-condition': ['warn', { checkLoops: false }],
    },
  },
];
