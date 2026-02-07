import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../types';
import { EnvelopeSimple, Lock, ArrowLeft, ArrowRight, GoogleLogo } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import AuthService from '../../services/AuthService';
import IslamicPatternBackground from '../../components/IslamicPatternBackground';
import { ISLAMIC_COLORS } from '../../theme';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await AuthService.signInWithEmail(email, password);
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios') return;
    setSocialLoading(true);
    try {
      await AuthService.signInWithApple();
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Sign-In', error.message);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS !== 'android') return;
    setSocialLoading(true);
    try {
      await AuthService.signInWithGoogle();
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Sign-In', error.message);
    } finally {
      setSocialLoading(false);
    }
  };

  const handleGuest = () => {
    AuthService.signInAsGuest();
    navigation.replace('MainTabs');
  };

  const gradientColors = [ISLAMIC_COLORS.primary, ISLAMIC_COLORS.secondary];

  return (
    <ScreenWrapper withPadding={false}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        style={[styles.headerBackground, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IslamicPatternBackground color="#fff" opacity={0.05} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" weight="bold" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.headerSubtitle}>Sign in to sync your spiritual journey</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Animated.View style={[styles.glassCard, { backgroundColor: theme.colors.surface, opacity: fadeAnim }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <EnvelopeSimple size={20} color={theme.colors.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
              <View style={[styles.inputWrapper, { borderColor: theme.colors.border }]}>
                <Lock size={20} color={theme.colors.textTertiary} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <ArrowRight size={20} color="#FFF" weight="bold" />
                </>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textTertiary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: theme.colors.border }]}
                onPress={handleAppleLogin}
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <ActivityIndicator color={theme.colors.text} />
                ) : (
                  <>
                    <Text style={styles.appleLogo}></Text>
                    <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>
                      Continue with Apple
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {Platform.OS === 'android' && (
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: theme.colors.border }]}
                onPress={handleGoogleLogin}
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <ActivityIndicator color={theme.colors.text} />
                ) : (
                  <>
                    <GoogleLogo size={22} color="#4285F4" weight="bold" />
                    <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.guestButton, { borderColor: theme.colors.border }]}
              onPress={handleGuest}
            >
              <Text style={[styles.guestButtonText, { color: theme.colors.primary }]}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp' as any)}>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    height: height * 0.28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    fontFamily: 'Poppins-Regular',
  },
  formContainer: {
    flex: 1,
    marginTop: -height * 0.06,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  glassCard: {
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  socialButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appleLogo: {
    fontSize: 18,
    color: '#000',
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  guestButton: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  guestButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default LoginScreen;
