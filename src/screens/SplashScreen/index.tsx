import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Star, Moon, Sun, Heart, Sparkle } from 'phosphor-react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationFinish }) => {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bismillahAnim = useRef(new Animated.Value(0)).current;
  
  // Floating elements animations
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;
  const star4Anim = useRef(new Animated.Value(0)).current;
  const star5Anim = useRef(new Animated.Value(0)).current;
  const moonAnim = useRef(new Animated.Value(0)).current;
  const sunAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Main content animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation for main logo
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bismillah writing animation
    Animated.timing(bismillahAnim, {
      toValue: 1,
      duration: 2000,
      delay: 1000,
      useNativeDriver: false,
    }).start();

    // Floating elements animations
    startFloatingAnimations();

    // Navigate after animation completes
    setTimeout(() => {
      onAnimationFinish();
    }, 4000);
  };

  const startFloatingAnimations = () => {
    // Stars floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(star1Anim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(star1Anim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star2Anim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(star2Anim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star3Anim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(star3Anim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star4Anim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(star4Anim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(star5Anim, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        }),
        Animated.timing(star5Anim, {
          toValue: 0,
          duration: 2800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Moon and Sun floating
    Animated.loop(
      Animated.sequence([
        Animated.timing(moonAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(moonAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(sunAnim, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Heart and Sparkle animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(heartAnim, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnim, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const star1TranslateY = star1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const star2TranslateY = star2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const star3TranslateY = star3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const moonTranslateY = moonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const sunTranslateY = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const star4TranslateY = star4Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const star5TranslateY = star5Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });

  const heartTranslateY = heartAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  const sparkleTranslateY = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const bismillahWidth = bismillahAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          theme.colors.primary,
          theme.colors.secondary,
          theme.colors.tertiary,
        ]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Background Elements */}
      <Animated.View
        style={[
          styles.floatingElement,
          styles.star1,
          {
            opacity: star1Anim,
            transform: [{ translateY: star1TranslateY }],
          },
        ]}
      >
        <Star size={20} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.star2,
          {
            opacity: star2Anim,
            transform: [{ translateY: star2TranslateY }],
          },
        ]}
      >
        <Star size={16} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.star3,
          {
            opacity: star3Anim,
            transform: [{ translateY: star3TranslateY }],
          },
        ]}
      >
        <Star size={24} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.moon,
          {
            opacity: moonAnim,
            transform: [{ translateY: moonTranslateY }],
          },
        ]}
      >
        <Moon size={28} color={theme.colors.surface} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.sun,
          {
            opacity: sunAnim,
            transform: [{ translateY: sunTranslateY }],
          },
        ]}
      >
        <Sun size={32} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.star4,
          {
            opacity: star4Anim,
            transform: [{ translateY: star4TranslateY }],
          },
        ]}
      >
        <Star size={14} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.star5,
          {
            opacity: star5Anim,
            transform: [{ translateY: star5TranslateY }],
          },
        ]}
      >
        <Star size={18} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.heart,
          {
            opacity: heartAnim,
            transform: [{ translateY: heartTranslateY }],
          },
        ]}
      >
        <Heart size={20} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingElement,
          styles.sparkle,
          {
            opacity: sparkleAnim,
            transform: [{ translateY: sparkleTranslateY }],
          },
        ]}
      >
        <Sparkle size={16} color={theme.colors.accent} weight="fill" />
      </Animated.View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.mainContent,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Main Logo/Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: pulseAnim },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          <View style={[styles.logoCircle, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.logoText, { color: theme.colors.primary }]}>
              ت
            </Text>
          </View>
        </Animated.View>

        {/* App Title */}
        <Animated.Text
          style={[
            styles.appTitle,
            { color: theme.colors.surface },
            { opacity: fadeAnim },
          ]}
        >
          Digital Tasbih
        </Animated.Text>

        {/* Bismillah with writing animation */}
        <Animated.View
          style={[
            styles.bismillahContainer,
            { opacity: fadeAnim },
          ]}
        >
          <Animated.View
            style={[
              styles.bismillahText,
              {
                color: theme.colors.surface,
                transform: [{ scaleX: bismillahWidth }],
              },
            ]}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Animated.View>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.appSubtitle,
            { color: theme.colors.surface },
            { opacity: fadeAnim },
          ]}
        >
          سُبْحَانَ اللهِ وَبِحَمْدِهِ
        </Animated.Text>

        {/* Description */}
        <Animated.Text
          style={[
            styles.appDescription,
            { color: theme.colors.surface },
            { opacity: fadeAnim },
          ]}
        >
          Your Digital Companion for Dhikr
        </Animated.Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.loadingDots}>
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: theme.colors.surface },
              {
                transform: [
                  {
                    scale: pulseAnim,
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: theme.colors.surface },
              {
                transform: [
                  {
                    scale: pulseAnim,
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.loadingDot,
              { backgroundColor: theme.colors.surface },
              {
                transform: [
                  {
                    scale: pulseAnim,
                  },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
  },
  star1: {
    top: height * 0.15,
    left: width * 0.1,
  },
  star2: {
    top: height * 0.25,
    right: width * 0.15,
  },
  star3: {
    top: height * 0.4,
    left: width * 0.2,
  },
  moon: {
    top: height * 0.1,
    right: width * 0.1,
  },
  sun: {
    top: height * 0.2,
    left: width * 0.05,
  },
  star4: {
    top: height * 0.35,
    right: width * 0.2,
  },
  star5: {
    top: height * 0.5,
    left: width * 0.15,
  },
  heart: {
    top: height * 0.6,
    right: width * 0.25,
  },
  sparkle: {
    top: height * 0.7,
    left: width * 0.3,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  logoText: {
    fontSize: 48,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bismillahContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  bismillahText: {
    fontSize: 26,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    transformOrigin: 'left',
    lineHeight: 36,
    writingDirection: 'rtl',
  },
  appSubtitle: {
    fontSize: 20,
    fontFamily: 'Amiri-Bold',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  appDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default SplashScreen;
