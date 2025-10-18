import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import CircularProgress from './ui/CircularProgress';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(width, height) * 0.5;

interface ModernTapTasbihProps {
  count: number;
  onIncrement: () => void;
  isCompleted: boolean;
  targetCount?: number;
}

const ModernTapTasbih: React.FC<ModernTapTasbihProps> = ({
  count,
  onIncrement,
  isCompleted,
  targetCount = 100,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseAnimation.start();

    // Continuous rotation for outer ring
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      }),
    );
    rotateAnimation.start();

    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    glowAnimation.start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: Math.min(count / targetCount, 1),
      duration: 300,
      useNativeDriver: false,
    }).start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
    };
  }, [count, targetCount, pulseAnim, rotateAnim, glowAnim, progressAnim]);

  const handlePress = () => {
    onIncrement();

    // Haptic feedback
    HapticFeedback.trigger('impactMedium', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    // Additional vibration for Android
    Vibration.vibrate(50);

    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderIslamicPattern = () => {
    const size = BUTTON_SIZE * 1.2;
    const center = size / 2;
    const radius = size * 0.3;

    // Create 8-pointed star (Khatam)
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const outerRadius = i % 2 === 0 ? radius : radius * 0.6;
      const x = center + Math.cos(angle) * outerRadius;
      const y = center + Math.sin(angle) * outerRadius;
      points.push(`${x},${y}`);
    }

    return (
      <Svg width={size} height={size} style={styles.patternSvg}>
        <Defs>
          <RadialGradient id="patternGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={`${theme.colors.accent}99`} />
            <Stop offset="50%" stopColor={`${theme.colors.accent}66`} />
            <Stop offset="100%" stopColor={`${theme.colors.accent}33`} />
          </RadialGradient>
          <RadialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={`${theme.colors.surface}20`} />
            <Stop offset="100%" stopColor={`${theme.colors.surface}40`} />
          </RadialGradient>
        </Defs>

        {/* Outer decorative circles */}
        <Circle
          cx={center}
          cy={center}
          r={radius * 1.4}
          fill="none"
          stroke={`${theme.colors.accent}66`}
          strokeWidth="2"
          strokeDasharray="12,6"
        />

        <Circle
          cx={center}
          cy={center}
          r={radius * 1.2}
          fill="none"
          stroke={`${theme.colors.surface}50`}
          strokeWidth="1"
          strokeDasharray="8,4"
        />

        {/* 8-pointed star */}
        <Polygon
          points={points.join(' ')}
          fill="url(#patternGradient)"
          stroke={`${theme.colors.accent}80`}
          strokeWidth="1.5"
        />

        {/* Inner circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.3}
          fill="url(#circleGradient)"
          stroke={`${theme.colors.accent}70`}
          strokeWidth="1"
        />

        {/* Decorative dots around the pattern */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 2 * Math.PI) / 12;
          const dotRadius = radius * 1.6;
          const x = center + Math.cos(angle) * dotRadius;
          const y = center + Math.sin(angle) * dotRadius;
          return (
            <Circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={
                count > i * Math.ceil(targetCount / 12)
                  ? theme.colors.accent
                  : `${theme.colors.surface}40`
              }
            />
          );
        })}
      </Svg>
    );
  };

  const getButtonColors = () => {
    if (isCompleted) {
      return [theme.colors.accent, theme.colors.warning, '#FFA500'];
    } else if (count > 0) {
      return [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary];
    } else {
      return [theme.colors.background, theme.colors.surface, theme.colors.card];
    }
  };

  const progress = Math.min(count / targetCount, 1);

  return (
    <View style={styles.container}>
      {/* Rotating Islamic Pattern */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ rotate: rotateInterpolate }, { scale: pulseAnim }],
          },
        ]}
      >
        {renderIslamicPattern()}
      </Animated.View>

      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            transform: [{ scale: Animated.multiply(pulseAnim, 1.1) }],
          },
        ]}
      >
        <LinearGradient
          colors={
            isCompleted
              ? [`${theme.colors.accent}40`, 'transparent']
              : [`${theme.colors.primary}40`, 'transparent']
          }
          style={styles.glowGradient}
        />
      </Animated.View>

      {/* Main Tap Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.tapButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getButtonColors()}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Button Content */}
            <View style={styles.buttonContent}>
              {/* Tap Instruction */}
              {/* <Text style={[styles.tapText, { color: theme.colors.surface }]}>
                ٹیپ کریں
              </Text> */}

              {/* Circular Progress */}
              <CircularProgress
                progress={progress}
                size={80}
                strokeWidth={4}
                variant="accent"
              >
                <Text style={[styles.countNumber, { color: theme.colors.surface }]}>
                  {count}
                </Text>
              </CircularProgress>

              {/* Completion indicator */}
              {isCompleted && (
                <View style={[styles.completionBadge, { backgroundColor: theme.colors.accent }]}>
                  <Text style={[styles.completionText, { color: theme.colors.surface }]}>
                    Completed ✨
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress Dots around the button */}
      <View style={styles.progressDots}>
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = index * 45 * (Math.PI / 180);
          const radius = BUTTON_SIZE * 0.75;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <Animated.View
              key={index}
              style={[
                styles.progressDot,
                {
                  left: width / 2 + x - 6,
                  top: height * 0.4 + y - 6,
                  opacity: count > index * Math.ceil(targetCount / 8) ? 1 : 0.3,
                  backgroundColor: isCompleted ? theme.colors.accent : theme.colors.primary,
                  transform: [
                    {
                      scale: count > index * Math.ceil(targetCount / 8) ? 1.3 : 0.8,
                    },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternSvg: {
    position: 'absolute',
  },
  glowContainer: {
    position: 'absolute',
    width: BUTTON_SIZE * 1.5,
    height: BUTTON_SIZE * 1.5,
    borderRadius: BUTTON_SIZE * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: BUTTON_SIZE * 0.75,
  },
  buttonContainer: {
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  tapButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  allahText: {
    fontSize: 48,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  tapText: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    opacity: 0.9,
  },
  countNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 8,
  },
  completionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  progressDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default ModernTapTasbih;
