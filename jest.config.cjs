module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/ui'],
  setupFilesAfterEnv: ['<rootDir>/tests/ui/jest.setup.cjs'],
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { presets: ['@babel/preset-env', '@babel/preset-react'] }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/ui/styleMock.cjs'
  },
};
