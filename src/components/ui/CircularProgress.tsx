import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  showPercentage = false,
  children,
  variant = 'primary',
}) => {
  const { theme } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);

  const getStrokeColor = (): string => {
    switch (variant) {
      case 'secondary':
        return theme.colors.secondary;
      case 'accent':
        return theme.colors.accent;
      default:
        return theme.colors.primary;
    }
  };

  const getBackgroundColor = (): string => {
    return theme.colors.border;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getBackgroundColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.content}>
        {children}
        {showPercentage && (
          <Text style={[styles.percentage, { color: theme.colors.text }]}>
            {Math.round(progress * 100)}%
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CircularProgress;
