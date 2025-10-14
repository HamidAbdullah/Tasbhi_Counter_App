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
  G,
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const BUTTON_SIZE = Math.min(width, height) * 0.55;

interface TapTasbihProps {
  count: number;
  onIncrement: () => void;
  isCompleted: boolean;
}

const TapTasbih: React.FC<TapTasbihProps> = ({
  count,
  onIncrement,
  isCompleted,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

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
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    glowAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
    };
  }, [pulseAnim, rotateAnim, glowAnim]);

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
        toValue: 0.92,
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
    const size = BUTTON_SIZE * 1.3;
    const center = size / 2;
    const radius = size * 0.35;

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
            <Stop offset="0%" stopColor="rgba(218, 165, 32, 0.6)" />
            <Stop offset="50%" stopColor="rgba(218, 165, 32, 0.3)" />
            <Stop offset="100%" stopColor="rgba(218, 165, 32, 0.1)" />
          </RadialGradient>
          <RadialGradient id="circleGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </RadialGradient>
        </Defs>

        {/* Outer decorative circles */}
        <Circle
          cx={center}
          cy={center}
          r={radius * 1.4}
          fill="none"
          stroke="rgba(218, 165, 32, 0.4)"
          strokeWidth="2"
          strokeDasharray="12,6"
        />

        <Circle
          cx={center}
          cy={center}
          r={radius * 1.2}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="8,4"
        />

        {/* 8-pointed star */}
        <Polygon
          points={points.join(' ')}
          fill="url(#patternGradient)"
          stroke="rgba(218, 165, 32, 0.6)"
          strokeWidth="1.5"
        />

        {/* Inner circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius * 0.3}
          fill="url(#circleGradient)"
          stroke="rgba(218, 165, 32, 0.5)"
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
                count > i ? 'rgba(218, 165, 32, 0.8)' : 'rgba(255,255,255,0.2)'
              }
            />
          );
        })}
      </Svg>
    );
  };

  const getButtonColors = () => {
    if (isCompleted) {
      return ['#DAA520', '#FFD700', '#FFA500'];
    } else if (count > 0) {
      return ['#1e7e34', '#4a7c59', '#6ba16e'];
    } else {
      return ['#0f2f23', '#1a4d3a', '#2d5a4a'];
    }
  };

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
              ? ['rgba(218, 165, 32, 0.3)', 'transparent']
              : ['rgba(74, 124, 89, 0.3)', 'transparent']
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
              {/* Arabic "Allah" */}
              <Text style={styles.allahText}>اللّٰہ</Text>

              {/* Tap Instruction */}
              <Text style={styles.tapText}>ٹیپ کریں</Text>

              {/* Count Display */}
              <View
                style={[
                  styles.countCircle,
                  {
                    backgroundColor: isCompleted
                      ? 'rgba(218, 165, 32, 0.3)'
                      : 'rgba(255, 255, 255, 0.2)',
                    borderColor: isCompleted
                      ? 'rgba(218, 165, 32, 0.6)'
                      : 'rgba(255, 255, 255, 0.4)',
                  },
                ]}
              >
                <Text style={styles.countNumber}>{count}</Text>
              </View>

              {/* Completion indicator */}
              {isCompleted && (
                <View style={styles.completionBadge}>
                  <Text style={styles.completionText}>Compleleted ✨</Text>
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
          const radius = BUTTON_SIZE * 0.8;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <Animated.View
              key={index}
              style={[
                styles.progressDot,
                {
                  left: width / 2 + x - 6,
                  top: height * 0.35 + y - 6,
                  opacity: count > index * 5 ? 1 : 0.3,
                  backgroundColor: isCompleted ? '#DAA520' : '#1e7e34',
                  transform: [
                    {
                      scale: count > index * 5 ? 1.3 : 0.8,
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
    fontSize: 54,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  tapText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    fontWeight: '600',
  },
  countCircle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 8,
  },
  countNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  countLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  completionBadge: {
    backgroundColor: 'rgba(218, 165, 32, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 5,
  },
  completionText: {
    color: '#0f2f23',
    fontSize: 14,
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
  instructionContainer: {
    position: 'absolute',
    bottom: -100,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  instructionSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default TapTasbih;
