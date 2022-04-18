/** @type {import("ts-jest/dist/types").InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'text'],
  coverageDirectory: 'test/coverage',
  rootDir: 'src/'
};