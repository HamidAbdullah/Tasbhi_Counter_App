/**
 * Reanimated: _WORKLET must exist on the JS thread. Set here before any Reanimated usage.
 * See: https://github.com/software-mansion/react-native-reanimated/issues/1423
 */
if (typeof global !== 'undefined') {
  global._WORKLET = false;
}
