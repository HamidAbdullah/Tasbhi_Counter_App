import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../types';
import { User, ArrowRight } from 'phosphor-react-native';

const { width, height } = Dimensions.get('window');

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const WelcomeScreen: React.FC = () => {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    const { theme } = useTheme();

    const handleLogin = () => {
        navigation.navigate('Login' as any);
    };

    const handleSkip = () => {
        navigation.navigate('MainTabs' as any);
    };

    const insets = useSafeAreaInsets();

    return (
        <ScreenWrapper withPadding={false}>
            <ImageBackground
                source={require('../../assests/images/welcome_bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                >
                    <View style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                        <View style={styles.topSection}>
                            {/* Logo or App Name */}
                            <View style={styles.logoContainer}>
                                <Text style={[styles.appName, { color: theme.colors.accent }]}>AL-NUR</Text>
                                <View style={styles.divider} />
                                <Text style={styles.tagline}>Spiritual Journey with Digital Tasbeeh</Text>
                            </View>
                        </View>

                        <View style={styles.bottomSection}>
                            <Text style={styles.welcomeText}>Welcome back</Text>
                            <Text style={styles.description}>
                                Enhance your spiritual practice with modern tools and traditional wisdom.
                            </Text>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
                                    onPress={handleLogin}
                                    activeOpacity={0.8}
                                >
                                    <User size={20} color="#FFF" weight="fill" />
                                    <Text style={styles.loginButtonText}>Login with Account</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.skipButton}
                                    onPress={handleSkip}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.skipButtonText}>Skip for now</Text>
                                    <ArrowRight size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.footerText}>
                                By continuing, you agree to our Terms and Privacy Policy
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        width: width,
        height: height,
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
    },
    topSection: {
        marginTop: height * 0.1,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 48,
        fontFamily: 'Poppins-Bold',
        letterSpacing: 4,
    },
    divider: {
        width: 60,
        height: 3,
        backgroundColor: '#DAA520',
        marginVertical: 15,
        borderRadius: 2,
    },
    tagline: {
        fontSize: 16,
        color: '#E0E0E0',
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
    },
    bottomSection: {
        marginBottom: height * 0.08,
    },
    welcomeText: {
        fontSize: 32,
        color: '#FFF',
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#CCC',
        fontFamily: 'Poppins-Regular',
        lineHeight: 24,
        marginBottom: 40,
    },
    buttonContainer: {
        gap: 15,
    },
    loginButton: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
    },
    skipButton: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    skipButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    footerText: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 30,
        fontFamily: 'Poppins-Regular',
    },
});

export default WelcomeScreen;
