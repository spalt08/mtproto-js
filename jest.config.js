module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)',
  ],
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/src/tl/layer105/'],
  coveragePathIgnorePatterns: ['/src/tl/layer105/'],
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
