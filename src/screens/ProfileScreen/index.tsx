import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Gear, ChartLineUp, ShieldCheck, SignOut, CaretRight, Trophy, SignIn, UserPlus } from 'phosphor-react-native';
import LinearGradient from 'react-native-linear-gradient';
import AuthService from '../../services/AuthService';
import { useNavigation, CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList, ProfileStackParamList } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

type ProfileScreenNavProp = CompositeNavigationProp<
    StackNavigationProp<ProfileStackParamList, 'Profile'>,
    BottomTabNavigationProp<TabParamList, 'ProfileTab'>
>;

const ProfileScreen: React.FC = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<ProfileScreenNavProp>();
    const insets = useSafeAreaInsets();
    const [user, setUser] = useState(AuthService.getCurrentUser());

    useEffect(() => {
        const unsubscribe = AuthService.onAuthStateChanged((user) => {
            setUser(user);
        });
        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await AuthService.signOut();
                        let root = navigation.getParent();
                        while (root?.getParent()) root = root.getParent();
                        root?.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Welcome' }] }));
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                },
            },
        ]);
    };

    const ProfileItem = ({ icon: Icon, label, value, onPress, isLast = false }: any) => (
        <TouchableOpacity
            style={[styles.profileItem, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
                    <Icon size={22} color={theme.colors.primary} weight="duotone" />
                </View>
                <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {value && <Text style={[styles.itemValue, { color: theme.colors.textSecondary }]}>{value}</Text>}
                <CaretRight size={18} color={theme.colors.textTertiary} />
            </View>
        </TouchableOpacity>
    );

    const StatCard = ({ label, value, icon: Icon, color }: any) => (
        <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
                <Icon size={20} color={color} weight="fill" />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
        </View>
    );

    // Guest view: description + Sign in / Sign up (navigate to root flow) + Settings
    const navigateToRoot = (screen: 'Login' | 'SignUp') => {
        let root: any = navigation.getParent();
        while (root?.getParent()) root = root.getParent();
        root?.navigate(screen);
    };

    if (!user) {
        return (
            <ScreenWrapper withPadding={false}>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={[styles.guestHeader, { paddingTop: insets.top + 24 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={[styles.guestAvatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <User size={44} color="#FFF" weight="duotone" />
                    </View>
                    <Text style={styles.guestTitle}>Me</Text>
                    <Text style={styles.guestSubtitle}>
                        If you want to store your data and see your rank, please login.
                    </Text>
                </LinearGradient>
                <View style={styles.guestContent}>
                    <Card variant="elevated" padding="large" style={[styles.guestCard, { backgroundColor: theme.colors.surface }]}>
                        <Text style={[styles.guestCardDesc, { color: theme.colors.textSecondary }]}>
                            If you want to store your data and want to see your rank, please login.
                        </Text>
                        <Button
                            title="Sign in"
                            onPress={() => navigateToRoot('Login')}
                            variant="primary"
                            fullWidth
                            icon={<SignIn size={20} color={theme.colors.surface} weight="bold" />}
                            style={styles.guestButton}
                        />
                        <Button
                            title="Sign up"
                            onPress={() => navigateToRoot('SignUp')}
                            variant="outline"
                            fullWidth
                            icon={<UserPlus size={20} color={theme.colors.primary} weight="bold" />}
                            style={styles.guestButton}
                        />
                        <View style={[styles.guestDivider, { backgroundColor: theme.colors.border }]} />
                        <TouchableOpacity
                            style={styles.guestSettingsRow}
                            onPress={() => navigation.navigate('Settings')}
                            activeOpacity={0.7}
                        >
                            <Gear size={22} color={theme.colors.primary} weight="duotone" />
                            <Text style={[styles.guestSettingsText, { color: theme.colors.text }]}>Settings</Text>
                            <CaretRight size={18} color={theme.colors.textTertiary} />
                        </TouchableOpacity>
                    </Card>
                    <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>
                        Version 1.0.0 (Build 42)
                    </Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper withPadding={false}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header / Profile Card */}
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={[styles.header, { paddingTop: insets.top + 20 }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.avatarContainer}>
                            <View style={[styles.avatar, { backgroundColor: theme.colors.accent }]}>
                                <User size={40} color="#FFF" weight="bold" />
                            </View>
                        </View>
                        <Text style={styles.userName}>{user?.displayName || 'Guest User'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'Join us to sync your data'}</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Stats Section */}
                    <View style={styles.statsContainer}>
                        <StatCard
                            label="Total Dhikr"
                            value="1,240"
                            icon={ChartLineUp}
                            color={theme.colors.primary}
                        />
                        <StatCard
                            label="Days Active"
                            value="12"
                            icon={Trophy}
                            color={theme.colors.accent}
                        />
                    </View>

                    {/* Account Settings */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>ACCOUNT</Text>
                        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <ProfileItem
                                icon={User}
                                label="Personal Info"
                                onPress={() => { }}
                            />
                            <ProfileItem
                                icon={ShieldCheck}
                                label="Privacy & Security"
                                onPress={() => { }}
                            />
                            <ProfileItem
                                icon={ChartLineUp}
                                label="Progress Tracking"
                                onPress={() => { }}
                                isLast={true}
                            />
                        </View>
                    </View>

                    {/* More Settings */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.textTertiary }]}>MORE</Text>
                        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                            <ProfileItem
                                icon={Gear}
                                label="Settings"
                                onPress={() => navigation.navigate('Settings')}
                            />
                            <ProfileItem
                                icon={SignOut}
                                label="Logout"
                                onPress={handleLogout}
                                isLast={true}
                            />
                        </View>
                    </View>

                    <Text style={[styles.versionText, { color: theme.colors.textTertiary }]}>
                        Version 1.0.0 (Build 42)
                    </Text>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    guestHeader: {
        paddingBottom: 32,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
    },
    guestAvatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    guestTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#FFF',
    },
    guestSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'rgba(255,255,255,0.85)',
        marginTop: 6,
        paddingHorizontal: 24,
        textAlign: 'center',
    },
    guestContent: {
        padding: 20,
        marginTop: -20,
    },
    guestCard: {
        borderRadius: 16,
        marginBottom: 24,
    },
    guestCardDesc: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
        marginBottom: 20,
    },
    guestButton: {
        marginBottom: 12,
    },
    guestDivider: {
        height: 1,
        width: '100%',
        marginVertical: 16,
    },
    guestSettingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    guestSettingsText: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    header: {
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#FFF',
    },
    userEmail: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'rgba(255,255,255,0.7)',
    },
    content: {
        padding: 20,
        marginTop: -30,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
        marginLeft: 5,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    itemValue: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        marginTop: 10,
    },
});

export default ProfileScreen;
