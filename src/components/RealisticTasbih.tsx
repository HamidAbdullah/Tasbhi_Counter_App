import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const BEAD_SIZE = 25;
const TOTAL_BEADS = 33;
const CHAIN_RADIUS = Math.min(width, height) * 0.3;

interface RealisticTasbihProps {
  count: number;
  onIncrement: () => void;
  isCompleted: boolean;
}

const RealisticTasbih: React.FC<RealisticTasbihProps> = ({
  count,
  onIncrement,
  isCompleted,
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isDragging, setIsDragging] = useState(false);

  const gestureHandler =
    useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
      onStart: (_, context) => {
        context.startRotation = rotation.value;
        runOnJS(setIsDragging)(true);
        scale.value = withSpring(1.05);
      },
      onActive: (event, context: any) => {
        const centerX = width / 2;
        const centerY = height / 2;

        const angle = Math.atan2(
          event.absoluteY - centerY,
          event.absoluteX - centerX,
        );

        const newRotation = (angle * 180) / Math.PI;
        const rotationDiff = newRotation - context.startRotation;

        rotation.value = context.startRotation + rotationDiff;

        // Trigger increment when passing a bead
        const beadAngle = 360 / TOTAL_BEADS;
        const currentBead = Math.floor(Math.abs(rotation.value) / beadAngle);
        const prevBead = Math.floor(
          Math.abs(context.startRotation) / beadAngle,
        );

        if (currentBead > prevBead) {
          runOnJS(onIncrement)();
        }

        context.startRotation = newRotation;
      },
      onEnd: () => {
        runOnJS(setIsDragging)(false);
        scale.value = withSpring(1);
      },
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  const renderBeads = () => {
    const beads = [];
    const angleStep = (2 * Math.PI) / TOTAL_BEADS;

    for (let i = 0; i < TOTAL_BEADS; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * CHAIN_RADIUS + width / 2;
      const y = Math.sin(angle) * CHAIN_RADIUS + height / 2;

      const isPassed = i < count % TOTAL_BEADS;
      const isActive = i === count % TOTAL_BEADS;

      beads.push(
        <View
          key={i}
          style={[
            styles.bead,
            {
              left: x - BEAD_SIZE / 2,
              top: y - BEAD_SIZE / 2,
              backgroundColor: isPassed
                ? isCompleted
                  ? '#FFD700'
                  : '#4a7c59'
                : isActive
                ? '#6ba16e'
                : '#8B4513',
              shadowColor: isPassed ? '#4a7c59' : '#000',
              elevation: isPassed ? 8 : 4,
            },
          ]}
        />,
      );
    }

    return beads;
  };

  const renderTasbihString = () => {
    const points = [];
    const angleStep = (2 * Math.PI) / TOTAL_BEADS;

    for (let i = 0; i <= TOTAL_BEADS; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * CHAIN_RADIUS + width / 2;
      const y = Math.sin(angle) * CHAIN_RADIUS + height / 2;
      points.push(`${x},${y}`);
    }

    return (
      <Svg style={styles.svgContainer} width={width} height={height}>
        <Defs>
          <RadialGradient id="stringGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#8B4513" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#654321" stopOpacity="0.6" />
          </RadialGradient>
        </Defs>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={CHAIN_RADIUS}
          fill="none"
          stroke="url(#stringGradient)"
          strokeWidth="3"
          strokeDasharray="5,3"
          opacity={0.7}
        />
      </Svg>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.tasbihContainer}>
        {renderTasbihString()}

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.beadsContainer, animatedStyle]}>
            {renderBeads()}
          </Animated.View>
        </PanGestureHandler>

        {/* Center Medallion */}
        <View style={styles.centerMedallion}>
          <Svg width={60} height={60}>
            <Defs>
              <RadialGradient id="medallionGradient" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
                <Stop offset="70%" stopColor="#DAA520" stopOpacity="1" />
                <Stop offset="100%" stopColor="#B8860B" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle
              cx={30}
              cy={30}
              r={25}
              fill="url(#medallionGradient)"
              stroke="#8B4513"
              strokeWidth="2"
            />
          </Svg>
        </View>

        {/* Instruction Text */}
        <View style={styles.instructionContainer}>
          <Animated.Text
            style={[styles.instructionText, { opacity: isDragging ? 0.5 : 1 }]}
          >
            تسبیح کو گھمائیں
          </Animated.Text>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasbihContainer: {
    width: width,
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  beadsContainer: {
    width: width,
    height: height * 0.6,
    position: 'absolute',
  },
  bead: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    borderRadius: BEAD_SIZE / 2,
    position: 'absolute',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  centerMedallion: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: -50,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default RealisticTasbih;
