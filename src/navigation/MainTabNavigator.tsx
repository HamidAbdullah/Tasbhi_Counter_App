import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ModernHomeScreen from '../screens/ModernHomeScreen';
import DigitalTasbeehScreen from '../screens/DigitalTasbeehScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../contexts/ThemeContext';
import { House, BluetoothConnected, User, Bluetooth } from 'phosphor-react-native';
import { Platform, ViewStyle } from 'react-native';
import { RootStackParamList, TabParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabNavigator = () => {
    const { theme, isDark } = useTheme();
    const SafeAreaContainerStyles: ViewStyle = {
        flex: 1
    }
    return (
        <SafeAreaView edges={['bottom']} style={SafeAreaContainerStyles}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        borderTopWidth: 0,
                        elevation: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        height: Platform.OS === 'ios' ? 90 : 70,
                        paddingBottom: Platform.OS === 'ios' ? 30 : 12,
                        paddingTop: 12,
                    },
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textTertiary,
                    tabBarLabelStyle: {
                        fontFamily: 'Poppins-Medium',
                        fontSize: 12,
                    },
                }}
            >
                <Tab.Screen
                    name="Dhikr"
                    component={ModernHomeScreen}
                    options={{
                        tabBarLabel: 'My Dhikr',
                        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
                            <House size={size} color={color} weight={focused ? 'fill' : 'regular'} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Digital"
                    component={DigitalTasbeehScreen}
                    options={{
                        tabBarLabel: 'Tasbeeh',
                        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
                            <BluetoothConnected size={size} color={color} weight={focused ? 'fill' : 'regular'} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Bluetooth"
                    component={BluetoothScreen}
                    options={{
                        tabBarLabel: 'Ring',
                        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
                            <Bluetooth size={size} color={color} weight={focused ? 'fill' : 'regular'} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="ProfileTab"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
                            <User size={size} color={color} weight={focused ? 'fill' : 'regular'} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
};

export default MainTabNavigator;
