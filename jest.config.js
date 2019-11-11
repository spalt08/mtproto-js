module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)',
  ],
  transform: {
    '^.+\\.(ts)?$': 'ts-jest',
    '^.+\\.(js)?$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
};
