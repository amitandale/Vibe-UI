module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/ui'],
  setupFilesAfterEnv: ['<rootDir>/tests/ui/jest.setup.cjs'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic', development: true }],
        ],
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/ui/styleMock.cjs',
  },
};
