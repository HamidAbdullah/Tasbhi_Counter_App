import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const { theme, isDark } = useTheme();

  const fadeIn = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;
  const beadScale = useRef(new Animated.Value(0)).current;
  const beadGlow = useRef(new Animated.Value(0.3)).current;
  const bismillahOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 3200;

    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(beadScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(beadGlow, {
          toValue: 0.7,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(beadGlow, {
          toValue: 0.3,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(bismillahOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 700,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressWidth, {
      toValue: 1,
      duration: duration - 400,
      delay: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start();

    const t = setTimeout(onAnimationFinish, duration);
    return () => clearTimeout(t);
  }, []);

  const progressInterpolate = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const splashGradient = isDark
    ? [theme.colors.background, theme.colors.surface, theme.colors.primary]
    : [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary];

  const beadOuterColor = isDark ? theme.colors.tertiary : theme.colors.surface;
  const beadInnerColor = isDark ? theme.colors.surface : theme.colors.primary;
  const textColor = isDark ? theme.colors.text : theme.colors.surface;
  const loadingBg = isDark ? theme.colors.card : 'rgba(255,255,255,0.25)';
  const loadingFill = isDark ? theme.colors.tertiary : theme.colors.surface;

  return (
    <ScreenWrapper statusBarHidden withPadding={false}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={splashGradient as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeIn,
            transform: [{ scale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.beadOuter,
            {
              backgroundColor: beadOuterColor,
              opacity: beadGlow,
              transform: [{ scale: beadScale }],
            },
          ]}
        >
          <View style={[styles.beadInner, { backgroundColor: beadInnerColor }]}>
            <Text style={[styles.beadLetter, { color: textColor }]}>تَ</Text>
          </View>
        </Animated.View>

        <Text style={[styles.title, { color: textColor }]}>Digital Tasbih</Text>

        <Animated.Text
          style={[
            styles.bismillah,
            { color: textColor, opacity: bismillahOpacity },
          ]}
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </Animated.Text>

        <Animated.Text
          style={[styles.subtitle, { color: textColor, opacity: bismillahOpacity }]}
        >
          سُبْحَانَ اللهِ وَبِحَمْدِهِ
        </Animated.Text>

        <Animated.Text
          style={[styles.tagline, { color: textColor, opacity: fadeIn }]}
        >
          Your companion for dhikr
        </Animated.Text>
      </Animated.View>

      <Animated.View style={[styles.loadingWrap, { opacity: fadeIn }]}>
        <View style={[styles.loadingTrack, { backgroundColor: loadingBg }]}>
          <Animated.View
            style={[
              styles.loadingFill,
              {
                backgroundColor: loadingFill,
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, width * 0.6],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  beadOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  beadInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beadLetter: {
    fontSize: 36,
    fontFamily: 'Amiri-Bold',
    writingDirection: 'rtl',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
    marginBottom: 20,
    textAlign: 'center',
  },
  bismillah: {
    fontSize: 22,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
    lineHeight: 34,
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    opacity: 0.9,
  },
  loadingWrap: {
    position: 'absolute',
    bottom: height * 0.12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loadingTrack: {
    width: width * 0.6,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default SplashScreen;
