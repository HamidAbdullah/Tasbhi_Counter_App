/**
 * Must be first: set global._WORKLET before Reanimated loads.
 */
import './src/polyfills';

import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
