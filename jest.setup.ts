import 'react-native-gesture-handler/jestSetup';

declare global {
  var __reanimatedWorkletInit: () => void;
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

global.__reanimatedWorkletInit = () => {};

export {};
