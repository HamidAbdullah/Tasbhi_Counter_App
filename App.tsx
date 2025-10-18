import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import ModernHomeScreen from './src/screens/ModernHomeScreen';
import { ZikrItem } from './src/types';
import ModernCounterScreen from './src/screens/ModernCounterScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import SplashScreen from './src/screens/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Counter: { zikr: ZikrItem };
  Settings: undefined;
  Dashboard: undefined;
  Leaderboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  
  const handleSplashFinish = () => {
    setShowSplash(false);
  };
  
  if (showSplash) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }
  
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.background} 
      />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Home" component={ModernHomeScreen} />
        <Stack.Screen name="Counter" component={ModernCounterScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
