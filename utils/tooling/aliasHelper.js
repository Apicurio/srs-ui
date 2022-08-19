const ignoredBinaries = ['png', 'svg', 'ico', 'scss'].join('|');
const testCommon = '<rootDir>/test-common';
const mockFile = `${testCommon}/mockfile.util.ts`;

const jestModuleMapper = {
  [`^.+\\.(${ignoredBinaries})$`]: mockFile,
  '@app/(.*)': '<rootDir>/src/$1',
  '@test-utils/(.*)': '<rootDir>/test-utils/$1',
  'react-i18next': `${testCommon}/react-i18next.js`,
};

module.exports = {
  jestModuleMapper,
};
