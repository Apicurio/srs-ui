const { jestModuleMapper } = require('../utils/tooling/aliasHelper');
const config = {
  rootDir: '.',
  clearMocks: true,
  testTimeout: 10000, // required for server tests, which take ~3 seconds to start
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    ...jestModuleMapper,
  },
  coverageReporters: ['json', 'text', 'lcov', 'json-summary'],
  moduleDirectories: ['node_modules', '<rootDir>']
};

module.exports = config;
