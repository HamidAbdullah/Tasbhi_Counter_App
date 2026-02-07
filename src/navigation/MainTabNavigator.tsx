import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ModernHomeScreen from '../screens/ModernHomeScreen';
import BluetoothScreen from '../screens/BluetoothScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { useTheme } from '../contexts/ThemeContext';
import { House, ChartBar, User, Bluetooth } from 'phosphor-react-native';
import { Platform, ViewStyle } from 'react-native';
import { TabParamList, ProfileStackParamList } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<TabParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        <ProfileStack.Screen name="Settings" component={SettingsScreen} />
        <ProfileStack.Screen name="Login" component={LoginScreen} initialParams={{ fromProfileTab: true }} />
        <ProfileStack.Screen name="SignUp" component={SignUpScreen} initialParams={{ fromProfileTab: true }} />
    </ProfileStack.Navigator>
);

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
                    component={DashboardScreen}
                    options={{
                        tabBarLabel: 'Dashboard',
                        tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
                            <ChartBar size={size} color={color} weight={focused ? 'fill' : 'regular'} />
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
                    component={ProfileStackNavigator}
                    options={{
                        tabBarLabel: 'Me',
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
