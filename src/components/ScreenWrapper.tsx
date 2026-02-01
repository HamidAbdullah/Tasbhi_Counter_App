import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle, StatusBarStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    barStyle?: StatusBarStyle;
    backgroundColor?: string;
    withPadding?: boolean;
    statusBarHidden?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
    children,
    style,
    barStyle,
    backgroundColor,
    withPadding = true,
    statusBarHidden = false,
}) => {
    const insets = useSafeAreaInsets();
    const { theme, isDark } = useTheme();

    const finalBackgroundColor = backgroundColor || theme.colors.background;
    const finalBarStyle = barStyle || (isDark ? 'light-content' : 'dark-content');

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: finalBackgroundColor,
                    paddingTop: withPadding ? insets.top : 0,
                    paddingBottom: withPadding ? insets.bottom : 0,
                    paddingLeft: withPadding ? insets.left : 0,
                    paddingRight: withPadding ? insets.right : 0,
                },
                style,
            ]}
        >
            <StatusBar
                barStyle={finalBarStyle}
                backgroundColor="transparent"
                translucent
                hidden={statusBarHidden}
            />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ScreenWrapper;
