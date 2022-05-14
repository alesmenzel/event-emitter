module.exports = {
  rootDir: '../',
  clearMocks: true,
  errorOnDeprecated: true,
  testMatch: ['<rootDir>/**/*.test.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/coverage/'],
};
