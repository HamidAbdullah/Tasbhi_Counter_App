import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../types';
import { ArrowRight, User } from 'phosphor-react-native';
import AuthService from '../../services/AuthService';
import { StorageUtils } from '../../Utils/StorageUtils';
import IslamicPatternBackground from '../../components/IslamicPatternBackground';
import { ISLAMIC_COLORS } from '../../theme';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [appleLoading, setAppleLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const gradientColors = isDark
    ? [ISLAMIC_COLORS.primary, ISLAMIC_COLORS.secondary]
    : [ISLAMIC_COLORS.primary, ISLAMIC_COLORS.secondary];

  const handleSignInWithApple = async () => {
    if (Platform.OS !== 'ios') return;
    setAppleLoading(true);
    try {
      await AuthService.signInWithApple();
      navigation.replace('MainTabs' as any);
    } catch (e: any) {
      Alert.alert('Sign-In', e?.message || 'Apple Sign-In failed.');
    } finally {
      setAppleLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    if (Platform.OS !== 'android') return;
    setGoogleLoading(true);
    try {
      await AuthService.signInWithGoogle();
      navigation.replace('MainTabs' as any);
    } catch (e: any) {
      Alert.alert('Sign-In', e?.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuest = async () => {
    AuthService.signInAsGuest();
    await StorageUtils.setAppOpened();
    navigation.replace('MainTabs' as any);
  };

  const handleLoginWithAccount = () => {
    navigation.navigate('Login' as any);
  };

  return (
    <ScreenWrapper withPadding={false}>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        style={[styles.gradient, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <IslamicPatternBackground color="#fff" opacity={0.05} />

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.topSection}>
            <Text style={styles.title}>Begin Your Dhikr Journey</Text>
            <Text style={styles.verse}>
              "Indeed, in the remembrance of Allah do hearts find rest"
            </Text>
            <Text style={[styles.reference, { color: 'rgba(255,255,255,0.9)' }]}>
              — Ar-Ra'd 13:28
            </Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.buttonContainer}>
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.primaryButton, styles.appleButton]}
                  onPress={handleSignInWithApple}
                  disabled={appleLoading}
                  activeOpacity={0.85}
                >
                  {appleLoading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <>
                      <Text style={styles.appleLogo}></Text>
                      <Text style={styles.primaryButtonText}>Continue with Apple</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {Platform.OS === 'android' && (
                <TouchableOpacity
                  style={[styles.primaryButton, { backgroundColor: theme.colors.surface }]}
                  onPress={handleSignInWithGoogle}
                  disabled={googleLoading}
                  activeOpacity={0.85}
                >
                  {googleLoading ? (
                    <ActivityIndicator color={theme.colors.primary} />
                  ) : (
                    <Text style={[styles.primaryButtonText, { color: theme.colors.primary }]}>
                      Continue with Google
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: 'rgba(255,255,255,0.5)' }]}
                onPress={handleGuest}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
                <ArrowRight size={18} color="rgba(255,255,255,0.9)" weight="bold" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleLoginWithAccount}
                activeOpacity={0.8}
              >
                <User size={18} color="rgba(255,255,255,0.85)" weight="regular" />
                <Text style={styles.linkButtonText}>Login with email</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.footerText, { color: 'rgba(255,255,255,0.7)' }]}>
              By continuing, you agree to our Terms and Privacy Policy
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width,
    minHeight: height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  topSection: {
    marginTop: height * 0.14,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  verse: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  reference: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    marginTop: 10,
    opacity: 0.9,
  },
  bottomSection: {
    marginBottom: height * 0.06,
  },
  buttonContainer: {
    gap: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  appleButton: {
    backgroundColor: '#fff',
  },
  appleLogo: {
    fontSize: 20,
    color: '#000',
  },
  primaryButtonText: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  secondaryButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.95)',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  linkButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Poppins-Regular',
  },
});

export default WelcomeScreen;
