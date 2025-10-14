import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle | any;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  style,
  onPress,
}) => {
  const { theme } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
    };

    // Padding
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.padding = theme.spacing.sm;
        break;
      case 'large':
        baseStyle.padding = theme.spacing.xl;
        break;
      default:
        baseStyle.padding = theme.spacing.md;
    }

    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.border;
        baseStyle.backgroundColor = theme.colors.surface;
        break;
      case 'filled':
        baseStyle.backgroundColor = theme.colors.surface;
        break;
      default:
        // Elevated
        baseStyle.backgroundColor = theme.colors.surface;
        baseStyle.shadowColor = theme.colors.shadow;
        baseStyle.shadowOffset = {
          width: 0,
          height: 2,
        };
        baseStyle.shadowOpacity = 0.1;
        baseStyle.shadowRadius = 8;
        baseStyle.elevation = 4;
    }

    return baseStyle;
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

export default Card;
