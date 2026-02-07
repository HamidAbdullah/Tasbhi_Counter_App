import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Vibration,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import { useTheme } from '../contexts/ThemeContext';
import CircularProgress from './ui/CircularProgress';

const { width } = Dimensions.get('window');
const FRAME_SIZE = Math.min(width * 0.78, 300);
const TAP_CENTER_SIZE = FRAME_SIZE * 0.42;
const SVG_SIZE = FRAME_SIZE; // used in frame styles (alias for clarity)

// Your golden ornamental frame PNG (typed via src/types/assets.d.ts)
const GOLDEN_FRAME = require('../assests/images/golden.png');

interface TapTasbeehFrameProps {
  count: number;
  onIncrement: () => void;
  isCompleted: boolean;
  targetCount?: number;
}

const TapTasbeehFrame: React.FC<TapTasbeehFrameProps> = ({
  count,
  onIncrement,
  isCompleted,
  targetCount = 100,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progress = Math.min(count / targetCount, 1);

  const handlePress = () => {
    onIncrement();
    HapticFeedback.trigger('impactLight', { enableVibrateFallback: true, ignoreAndroidSystemSettings: false });
    Vibration.vibrate(30);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 400,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const centerGradient = isCompleted
    ? ['#d4af37', '#c9a227', '#b8960c']
    : ['#c9a227', '#b8960c', '#9a7b0a'];

  return (
    <View style={styles.wrapper}>
      {/* Your golden ornamental frame PNG – central disc is tap target */}
      <View style={styles.frameContainer}>
        <Image
          source={GOLDEN_FRAME}
          style={styles.frameImage}
          resizeMode="contain"
        />
        <Animated.View
          style={[
            styles.tapOverlay,
            {
              width: TAP_CENTER_SIZE,
              height: TAP_CENTER_SIZE,
              borderRadius: TAP_CENTER_SIZE / 2,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            style={[styles.tapCenter, { width: TAP_CENTER_SIZE, height: TAP_CENTER_SIZE, borderRadius: TAP_CENTER_SIZE / 2 }]}
          >
            <LinearGradient
              colors={centerGradient}
              style={styles.tapGradient}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
            >
              <View style={styles.tapContent}>
                <CircularProgress
                  progress={progress}
                  size={TAP_CENTER_SIZE * 0.62}
                  strokeWidth={4}
                  variant="accent"
                >
                  <Text style={styles.countText}>{count}</Text>
                </CircularProgress>
                {isCompleted && (
                  <View style={styles.donePill}>
                    <Text style={styles.doneText}>Round done</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Text style={[styles.tapHint, { color: theme.colors.surface }]}>Tap the centre to count</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: FRAME_SIZE + 40,
    height: FRAME_SIZE + 56,
  },
  frameContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  frameImage: {
    position: 'absolute',
    width: SVG_SIZE,
    height: SVG_SIZE,
  },
  tapOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  tapCenter: {
    overflow: 'hidden',
  },
  tapGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: TAP_CENTER_SIZE / 2,
  },
  tapContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  donePill: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  doneText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  tapHint: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    opacity: 0.9,
  },
});

export default TapTasbeehFrame;
