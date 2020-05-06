module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)',
  ],
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/src/tl/layer113/'],
  coveragePathIgnorePatterns: ['/src/tl/layer113/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  globals: {
    'ts-jest': {
      tsConfig: {
        target: 'es2020',
      },
    },
  },
};
