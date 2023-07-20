module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^react-native-splash-screen$':
      '<rootDir>/__mocks__/react-native-splash-screen.tsx',
    'node-fetch': 'jest-fetch-mock',
  },
};
