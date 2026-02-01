import React, { useState } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../types';
import { EnvelopeSimple, Lock, GoogleLogo, ArrowLeft, ArrowRight } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import AuthService from '../../services/AuthService';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await AuthService.signInWithEmail(email, password);
            navigation.navigate('MainTabs');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await AuthService.signInWithGoogle();
            navigation.navigate('MainTabs');
        } catch (error: any) {
            Alert.alert('Google Sign-In Failed', error.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <ScreenWrapper withPadding={false}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.headerBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={{ paddingTop: insets.top }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#FFF" weight="bold" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>Welcome Back</Text>
                        <Text style={styles.headerSubtitle}>Sign in to sync your spiritual journey</Text>
                    </View>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formContainer}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={[styles.glassCard, { backgroundColor: `${theme.colors.surface}DD` }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.colors.text }]}>Email Address</Text>
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
                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={[styles.forgotText, { color: theme.colors.primary }]}>Forgot Password?</Text>
                            </TouchableOpacity>
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

                        <TouchableOpacity
                            style={[styles.googleButton, { borderColor: theme.colors.border }]}
                            onPress={handleGoogleLogin}
                            disabled={googleLoading}
                        >
                            {googleLoading ? (
                                <ActivityIndicator color={theme.colors.text} />
                            ) : (
                                <>
                                    <GoogleLogo size={24} color="#DB4437" weight="bold" />
                                    <Text style={[styles.googleButtonText, { color: theme.colors.text }]}>Continue with Google</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

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
    container: {
        flex: 1,
    },
    headerBackground: {
        height: height * 0.3,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
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
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontFamily: 'Poppins-Bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Poppins-Medium',
    },
    formContainer: {
        flex: 1,
        marginTop: -height * 0.08,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    glassCard: {
        padding: 25,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 55,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    forgotText: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
    },
    loginButton: {
        height: 60,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
    },
    googleButton: {
        height: 55,
        borderRadius: 15,
        borderWidth: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    googleButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    footerLink: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
});

export default LoginScreen;
